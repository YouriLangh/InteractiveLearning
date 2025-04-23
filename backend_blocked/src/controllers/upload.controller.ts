import { Request, Response } from 'express';
import fs from "fs";
import path from "path";
import { spawn } from "child_process";


export const solve = async (req: Request, res: Response): Promise<Response> => {
    const { image, fileType } = req.body;
    if (!image || !fileType) {
      return res.status(400).send("Image or fileType is missing.");
    }
    console.log("Received Image");
    const fileBuffer = Buffer.from(image, "base64");
    const fileName = "uploaded_image.png";
    const filePath = path.join(__dirname, "..", "uploads", fileName);
    console.log("fp: ", filePath)
    const scriptPath = path.join(__dirname, "..", "utils", "process_image.py");
    console.log("sp: ", scriptPath)
    fs.writeFileSync(filePath, fileBuffer); // sync to ensure file is ready before spawning
    console.log("Image written to file");
    const python = spawn("python", [scriptPath, filePath]);

  
    console.log("Starting Python script...");
    let result = "";
    python.stdout.on("data", (data) => {
      result += data.toString();
    });
  
    python.on("close", (code) => {
      try {
        console.log("Parsing finished");
        if(result.length === 0) {  
            console.error("Python script returned no result");
            return res.status(500).send("No result from Python script");
            }
        const json = JSON.parse(result);
        res.send({
          message: "Image processed",
          darkSpotCount: json.count,
          processedImage: json.image, // base64 string of the processed image
        });
      } catch (err) {
        console.error("Error parsing Python response:", err);
        res.status(500).send("Failed to parse result");
      }
    });
  
    python.stderr.on("data", (data) => {
      console.error(`Python error: ${data}`);
    });
  }