import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

/**
 *  This function handles the image upload and processing.
 *  It receives an image in base64 format, saves it to a file, and then calls a Python script to process the image.
 * It returns the result of the processing, including the count of dark spots, whether that count is the same as the required answer, and a processed image.
 */
export const solve = async (req: Request, res: Response) => {
  const { image, fileType, answer } = req.body;
  if (!image || !fileType || !answer) {
    return res.status(400).send("Image or fileType is missing.");
  }
  // Save the image to a file
  const fileBuffer = Buffer.from(image, "base64");
  const fileName = "uploaded_image.png";
  const filePath = path.join(__dirname, "..", "uploads", fileName);
  const scriptPath = path.join(__dirname, "..", "utils", "process_image.py");
  fs.writeFileSync(filePath, fileBuffer); // sync to ensure file is ready before spawning

  // Spawn a Python process
  const python = spawn("python", [scriptPath, filePath]);

  // Handle Python script output
  let result = "";
  python.stdout.on("data", (data) => {
    result += data.toString();
  });

  // When the Python script is done, parse the result and send it back
  python.on("close", (code) => {
    try {
      console.log("Parsing finished");
      if (result.length === 0) {
        console.error("Python script returned no result");
        return res.status(500).send("No result from Python script");
      }
      const json = JSON.parse(result);
      console.log(json.resolution);
      res.send({
        message: "Image processed",
        darkSpotCount: json.count,
        processedImage: json.image, // base64 string of the processed image
        solved: json.count === answer,
      });
    } catch (err) {
      console.error("Error parsing Python response:", err);
      res.status(500).send("Failed to parse result");
    }
  });

  python.stderr.on("data", (data) => {
    console.error(`Python error: ${data}`);
  });
};
