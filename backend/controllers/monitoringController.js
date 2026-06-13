const {
  CloudWatchClient,
  GetMetricStatisticsCommand
} = require("@aws-sdk/client-cloudwatch");
const db = require("../config/db");

const client = new CloudWatchClient({
  region: process.env.AWS_REGION
});
console.log("AWS_REGION =", process.env.AWS_REGION);

async function getMetric(namespace, metricName) {

  const command = new GetMetricStatisticsCommand({
    Namespace: namespace,
    MetricName: metricName,
    StartTime: new Date(Date.now() - 3600000),
    EndTime: new Date(),
    Period: 300,
    Statistics: ["Average"]
  });

  console.log("Getting metric:", namespace, metricName);

  const data = await client.send(command);

  console.log("Namespace:", namespace);
  console.log("Metric:", metricName);
  console.log(JSON.stringify(data, null, 2));

  const points = data.Datapoints || [];

  if (!points.length) return 0;

  const latest = points.sort(
    (a, b) =>
      new Date(b.Timestamp) -
      new Date(a.Timestamp)
  )[0];

  return Math.round(latest.Average || 0);
}

exports.getMonitoring = async (req, res) => {

  try {

    const cpuCommand = new GetMetricStatisticsCommand({
      Namespace: "AWS/EC2",
      MetricName: "CPUUtilization",
      Dimensions: [
        {
          Name: "InstanceId",
          Value: process.env.EC2_INSTANCE_ID
        }
      ],
      StartTime: new Date(Date.now() - 3600000),
      EndTime: new Date(),
      Period: 300,
      Statistics: ["Average"]
    });

    const cpuData = await client.send(cpuCommand);

    const cpuPoints = cpuData.Datapoints || [];

    const cpu =
      cpuPoints.length > 0
        ? Math.round(
          cpuPoints.sort(
            (a, b) =>
              new Date(b.Timestamp) -
              new Date(a.Timestamp)
          )[0].Average || 0
        )
        : 0;

    console.log(JSON.stringify(cpuData, null, 2));

    const memoryCommand =
      new GetMetricStatisticsCommand({
        Namespace: "CWAgent",
        MetricName: "mem_used_percent",
        Dimensions: [
          {
            Name: "host",
            Value: "ip-172-31-41-191"
          }
        ],
        StartTime: new Date(Date.now() - 3600000),
        EndTime: new Date(),
        Period: 300,
        Statistics: ["Average"]
      });

    const memoryData =
      await client.send(memoryCommand);

    const memoryPoints = memoryData.Datapoints || [];

    const memory =
      memoryPoints.length > 0
        ? Math.round(
          memoryPoints.sort(
            (a, b) =>
              new Date(b.Timestamp) -
              new Date(a.Timestamp)
          )[0].Average || 0
        )
        : 0;

    const diskCommand =
      new GetMetricStatisticsCommand({
        Namespace: "CWAgent",
        MetricName: "disk_used_percent",
        Dimensions: [
          {
            Name: "path",
            Value: "/"
          },
          {
            Name: "device",
            Value: "nvme0n1p1"
          },
          {
            Name: "fstype",
            Value: "ext4"
          },
          {
            Name: "host",
            Value: "ip-172-31-41-191"
          }
        ],
        StartTime: new Date(Date.now() - 3600000),
        EndTime: new Date(),
        Period: 300,
        Statistics: ["Average"]
      });

    const diskData =
      await client.send(diskCommand);

    const diskPoints = diskData.Datapoints || [];

    const disk =
      diskPoints.length > 0
        ? Math.round(
          diskPoints.sort(
            (a, b) =>
              new Date(b.Timestamp) -
              new Date(a.Timestamp)
          )[0].Average || 0
        )
        : 0;

    res.json({
      cpu,
      memory,
      disk,
      status: "Healthy",
      uptime: "Running"
    });

  } catch (err) {

    console.error("CloudWatch Error:", err);

    res.status(500).json({
      error: err.message
    });

  }

};

exports.getLogs = (req,res) => {

  db.query(
    `
    SELECT *
    FROM audit_logs
    ORDER BY created_at DESC
    LIMIT 10
    `,
    (err,result) => {

      if(err){
        return res.status(500).json({
          error: err.message
        });
      }

      res.json(result);

    }
  );

};