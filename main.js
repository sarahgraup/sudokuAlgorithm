const fsP = require('fs/promises')



async function readMyFile() {
    let contents;
    try {
       contents = await fsP.readFile("sudokus/s01a.txt", "utf8");
     
    } catch (err) {
      process.exit(1);
    }

    const board = contents.split('\r\n').map(r=>r.trim()).map(c=>c.split(' ').map(Number));


    return board;

    
  }



//   readMyFile();


module.exports={readMyFile};