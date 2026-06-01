
const fs = require('fs');


class Student{
    constructor(name, scores){
        this.name = name;
        this.scores = scores;
    }
    get average(){
        if(this.scores.length === 0) return 0;
        let sum=0;
        for(let i=0; i<this.scores.length; i++){
            sum += this.scores[i];
        }
        return sum/this.scores.length;
    }
    get letterGrade(){
        const avg = this.average;
        if(avg >= 90) return 'A';
        else if(avg >= 80) return 'B';
        else if(avg >= 70) return 'C';
        else if(avg >= 60) return 'D';
        else return 'F';
        //Scale: A (>=90), B (>=80), C (>=70), D (>=60), F (<60)
    }
    summary(){
        if(this.scores.length == 0){
            return { highest:0, lowest:0};   
        }
        let highest = this.scores[0];
        let lowest = this.scores[0];
        for(let i=1; i<this.scores.length; i++){
            if(this.scores[i] > highest) highest = this.scores[i];
            if(this.scores[i] < lowest) lowest = this.scores[i];
        }
        return { highest, lowest};
    }

}

function getRemark(grade) {
  switch (grade) {
    case 'A':
      return "Excellent performance!";
    case 'B':
      return "Good job, well done.";
    case 'C':
      return "Satisfactory effort.";
    case 'D':
      return "Needs improvement.";
    case 'F':
      return "Critical review required.";
    default:
      return "No remark available.";
  }
}

/*const studentName=process.argv[2];
const scores=process.argv.slice(3).map(score => Number(score));
if(!studentName || scores.length < 3){
    console.log("Error: Please provide a student name and at least 3 exam scores.");
    console.log("Usage: node reportcard.js <studentName> <score1> <score2> <score3> ...");
    process.exit(1);
}
const student=new Student(studentName, scores);*/


function printSingleReport(student){
    const avgScore = student.average.toFixed(1);
    const grade = student.letterGrade;
    const { highest, lowest } = student.summary();

    const status = student.average >= 60 ? "PASS" : "FAIL";
    const remark = getRemark(grade);

    const [score1, score2, ...remainingScores] = student.scores;


    const reportCardOutput = `
    ============================================
                STUDENT REPORT CARD            
    ============================================
    Student Name : ${student.name}
    Status       : ${status}
    --------------------------------------------
    Score 1      : ${score1}
    Score 2      : ${score2}
    Other Scores : ${remainingScores.length > 0 ? remainingScores.join(', ') : 'None'}
    --------------------------------------------
    Highest Score: ${highest}
    Lowest Score : ${lowest}
    Average Score: ${avgScore}
    Final Grade  : ${grade}
    Remark       : ${remark}
    ============================================
    `;

    console.log(reportCardOutput);
}

if (process.argv[2] === '--json') {
  const filePath = process.argv[3];

  if (!filePath) {
    console.error("Error: Please provide a JSON file path.");
    console.error("Usage: node reportCard.js --json <filename.json>");
    process.exit(1);
  }

  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const studentsArray = JSON.parse(rawData);
    
    let topStudentObj = null;
    let highestAverage = -1;

    console.log(`\n[Multi-Student Mode] Processing ${studentsArray.length} records...`);

    studentsArray.forEach(data => {
      const student = new Student(data.name, data.scores);
      printSingleReport(student);

      if (student.average > highestAverage) {
        highestAverage = student.average;
        topStudentObj = student;
      }
    });

    if (topStudentObj) {
      console.log(`

  TOP PERFORMER OF THE BATCH
  Name: ${topStudentObj.name}
`);
    }

  } catch (error) {
    console.error("Failed to read or parse JSON file:", error.message);
    process.exit(1);
  }

} else {
  const studentName = process.argv[2];
  const rawScores = process.argv.slice(3);
  const scores = rawScores.map(score => Number(score));

  if (!studentName || scores.length < 3) {
    console.error("Error: Invalid inputs for manual mode.");
    console.error("Usage (Manual): node reportCard.js <StudentName> <score1> <score2> <score3> ...");
    console.error("Usage (JSON Batch): node reportCard.js --json <filename.json>");
    process.exit(1);
  }

  const student = new Student(studentName, scores);
  printSingleReport(student);
}