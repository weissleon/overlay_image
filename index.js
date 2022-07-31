const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const ffprobePath = require("ffprobe-static");
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath.path);

const input1 = process.argv[2];

const checkCommand = ffmpeg();

// checkCommand
//   .input("asset/intro.mp4")
//   .input(input1)
//   .ffprobe((err, data) => {
//     console.log(data);
//   });

const command = ffmpeg();

command.on("start", (cmdline) => {
  console.log(cmdline);
});

command
  .input(input1)
  .input("asset/stove_indie_kr.png")
  .input("asset/intro.mp4")
  .input("asset/ending_card.png")
  .inputOptions("-loop 1")
  // .filterGraph([
  //   {
  //     filter: "overlay",
  //     // options: { enable: "between(t,0,20)" },
  //     inputs: "[0:0][1:0]",
  //     outputs: ["v1"],
  //   },
  // ])
  // .outputOptions(["-map [v1]", "-map 0:1"])
  .filterGraph([
    {
      filter: "overlay",
      // options: { enable: "between(t,0,20)" },
      inputs: "[0:0][1:0]",
      outputs: ["v1"],
    },
    {
      filter: "concat",
      options: {
        n: 2,
        v: 1,
        a: 1,
      },
      inputs: "[2:0][2:1][v1][0:1]",
      outputs: "[v2][a2]",
    },
    {
      filter: "trim",
      options: {
        duration: "5",
      },
      inputs: "[3:0]",
      outputs: "v3",
    },
    {
      filter: "concat",
      options: {
        n: 2,
        v: 1,
      },
      inputs: "[v2][v3]",
      outputs: "[v4]",
    },
  ])
  .map("[v4]")
  .map("[a2]");

command
  .videoCodec("libx264")
  .withVideoBitrate(`7881k`)
  .withFpsOutput(29.97)
  .save("output/output.mp4");
