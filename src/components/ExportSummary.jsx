import React from "react";
import * as XLSX from "xlsx";
import { Button } from "@mui/material";
import { encryptFilename } from '../common/pdfCrypt';
import { imgUrl } from '../common/api';

const ExportToExcelButton = ({ data, fileName = "User_Summary" ,disabled }) => {

  const sanitizeSheetName = (name) => {
    // Remove invalid Excel sheet characters : \ / ? * [ ] and limit to 31 chars
    return name.replace(/[:\\/?*\[\]]/g, "").substring(0, 31);
  };

  const handleExport = () => {
    if (!data || !data.exams) return;

    const wb = XLSX.utils.book_new();

    // --- Tests Sheet ---
    const testsSheet = data.exams.map((test) => ({
      TestID: test.exam_id,
      Title: test.title,
      Status: test.status,
      StartDate: test.start_date,
      EndDate: test.end_date,
      MinMarks: test.min_marks || test.minMarks,
      TotalUsers: test.groups?.reduce((sum, g) => sum + g.users.length, 0),
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(testsSheet), "Tests");

    // --- Groups Sheet ---
    const groupsSheet = data.exams.flatMap((test) =>
      test.groups.map((group) => {
        const moduleAverages = test.sections?.map((section) => {
          const totalUsers = group.users.length;
          const passedUsers = group.users.filter(u =>
            u.obtained?.some(o => o.sectionId === section.id && o.status === "pass")
          ).length;
          return `${section.name}: ${totalUsers ? Math.round((passedUsers / totalUsers) * 100) : 0}%`;
        }).join(", ");

        const passCount = group.users.filter(u => u.status === "pass").length;
        const failCount = group.users.filter(u => u.status === "fail").length;
        const pendingCount = group.users.filter(u => !u.status).length;

        return {
          TestTitle: test.title,
          GroupName: group.groupName,
          TotalUsers: group.users.length,
          ModuleAverages: moduleAverages,
          Pass: passCount,
          Fail: failCount,
          Pending: pendingCount
        };
      })
    );
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(groupsSheet), "Groups");

    // --- Individual Test Sheets ---
    data.exams.forEach((test) => {
      const testUsersSheet = test.groups.flatMap((group) =>
        group.users.map((user) => {
          const obj = {
            GroupName: group.groupName,
            UserName: user.name,
            OverallStatus: user.status || "pending",
            TotalObtained: user.obtained?.reduce((sum, o) => sum + (o.marks || 0), 0),
            MaxTotal: test.sections?.reduce((sum, s) => sum + (s.maxMarks || 0), 0),
            Passed: user.status === "pass" ? "✅" : "❌",
          };

          test.sections?.forEach((section) => {
            const obtainedObj = user.obtained?.find(o => o.sectionId === section.id);
            obj[`${section.name} (Obtained/Max)`] = obtainedObj ? `${obtainedObj.marks}/${section.maxMarks}` : `0/${section.maxMarks}`;
            obj[`${section.name} Status`] = obtainedObj ? obtainedObj.status : "pending";
          });

          if (user.status === "pass") {
            const encryptedName = encryptFilename(`${user.id}_${test.exam_id}`);
            obj.CertificateURL = `${imgUrl}/uploads/certificates/${encryptedName}.pdf`;
          }

          return obj;
        })
      );

      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(testUsersSheet), sanitizeSheetName(test.title));
    });

    // --- Save Excel ---
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <Button variant="contained" color="primary" onClick={handleExport} disabled={disabled}>
      Export to Excel
    </Button>
  );
};

export default ExportToExcelButton;
