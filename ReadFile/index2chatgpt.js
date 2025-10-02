import fs from "node:fs/promises";
import readline from "readline";

const readData = async () => {
  const fileHandleRead = await fs.open("testdat.csv", "r");
  const fileHandleWrite = await fs.open("Write.csv", "w");

  const filereadstream = fileHandleRead.createReadStream({ encoding: "utf-8" });
  const fileWriteStream = fileHandleWrite.createWriteStream({
    encoding: "utf-8",
  });

  let i = 0;
  const rl = readline.createInterface({
    input: filereadstream,
    crlfDelay: Infinity, // ✅ no need for output here
  });

  // rl.on("line", (line) => {
  //   const data = line.split(",");

  //   if (!fileWriteStream.write(`${line}\n`)) {
  //     rl.pause();
  //   }
  //   fileWriteStream.("drain", () => {
  //     rl.resume();
  //   });
  // });

  for await (let r of filereadstream) {
    if (!fileWriteStream.write(r)) {
      await new Promise((resolve) => {
        fileWriteStream.once("drain", resolve);
      });
    }
  }
  await new Promise((resolve) => {
    fileWriteStream.end(resolve);
  });

  await fileHandleWrite.close();
  await fileHandleRead.close();
  console.log("✅ File descriptor closed");
};

readData();
