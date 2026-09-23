import computeStatus, {
  computeAverage,
  EnrollmentStatus
} from "./gradeUtils";

// Interface for enrollee data
interface Enrollee {
  name: string;
  prelim: number;
  midterm: number;
  final: number;
}

// Interface for eligibility report
interface EligibilityReport {
  name: string;
  average: number;
  status: EnrollmentStatus;
  remarks?: string;
}

// Starter data
const enrollees: Enrollee[] = [
  { name: "Ana Cruz", prelim: 85, midterm: 90, final: 88 },
  { name: "Bea Santos", prelim: 70, midterm: 65, final: 60 },
  { name: "Cid Ramos", prelim: 95, midterm: 92, final: 97 },
  { name: "Dex Alonzo", prelim: 60, midterm: 55, final: 50 },
  { name: "Eli Tan", prelim: 78, midterm: 80, final: 76 }
];

// Simulated registrar API
function getEnrollees(): Promise<Enrollee[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(enrollees);
    }, 500);
  });
}

// Union type
let batchId: string | number = "BATCH-001";

// Union type narrowing
if (typeof batchId === "string") {
  console.log(`Processing batch: ${batchId}`);
} else {
  console.log(`Processing numeric batch: ${batchId}`);
}

// Generic function
function groupBy<T>(
  items: T[],
  keyFn: (item: T) => string
): Record<string, T[]> {
  return items.reduce((groups, item) => {
    const key = keyFn(item);

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

// Main async function
async function main(): Promise<void> {
  try {
    const data = await getEnrollees();

    // Map: Create typed reports
    const reports: EligibilityReport[] = data.map((student) => {
      const average = computeAverage(
        student.prelim,
        student.midterm,
        student.final
      );

      const status = computeStatus(average);

      const report: EligibilityReport = {
        name: student.name,
        average,
        status
      };

      if (status === EnrollmentStatus.Probation) {
        report.remarks = "Needs consultation";
      }

      return report;
    });

    // Reduce: Calculate class average
    const classAverage =
      reports.reduce((sum, report) => sum + report.average, 0) /
      reports.length;

    // Generic grouping
    const groupedReports = groupBy(
      reports,
      (report) => report.status
    );

    // Formatted output
    console.log(
      "\n=== IT313 Enrollment Eligibility Report (TypeScript) ==="
    );

    reports.forEach((report) => {
      const remark = report.remarks
        ? ` - ${report.remarks}`
        : "";

      console.log(
        `${report.name} - Average: ${report.average.toFixed(2)} - ${report.status}${remark}`
      );
    });

    const passingCount =
      groupedReports[EnrollmentStatus.Passing]?.length ?? 0;

    console.log(`Class Average: ${classAverage.toFixed(2)}`);
    console.log(`Passing: ${passingCount} / ${reports.length}`);
  } catch (error) {
    console.error("Failed to retrieve enrollee data:", error);
  }
}

main();