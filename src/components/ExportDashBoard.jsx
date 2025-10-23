import React from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@mui/material';
import { format } from 'date-fns';

const ExportToExcelButton = ({ data, selectedGroup, groups, groupName, disabled }) => {
  const sanitizeSheetName = (name) => {
    // Remove invalid Excel sheet characters : \ / ? * [ ] and limit to 31 chars
    return name.replace(/[:\\/?*\[\]]/g, '').substring(0, 31);
  };

  const handleExport = () => {
    if (!data || !data.cards) {
      alert('No data available to export.');
      return;
    }

    const wb = XLSX.utils.book_new();

    // --- Dashboard Summary Sheet ---
    const summaryData = [
      ['Dashboard Summary', ''],
      ['Metric', 'Value'],
      ['Total Users', data.cards.totalUsers || 0],
      [selectedGroup ? 'Start Date' : 'Total Tests', data.cards.totalExams || 'N/A'],
      [selectedGroup ? 'End Date' : 'Active Tests', data.cards.activeExams || 'N/A'],
      ['Certificates Issued', data.cards.certificatesIssued || 0],
      [],
      ['Certificates Status', ''],
      ['Status', 'Count'],
      ['Issued', data.pieChart?.issuedCertificates || 0],
      ['Pending', data.pieChart?.pendingCertificates || 0],
    ];

    if (selectedGroup) {
      // Section-wise Time Spent
      summaryData.push([], ['Section-wise Time Spent', '']);
      summaryData.push(['Section', 'Time Spent (Hours)']);
      (data.curveChart || []).forEach((item) => {
        summaryData.push([item.day, item.total_time.toFixed(2)]);
      });

      // Module Passing Rates
      summaryData.push([], ['Module Passing Rates', '']);
      summaryData.push(['Module', 'Passing Rate (%)']);
      (data.modulePassingRates || []).forEach((item) => {
        summaryData.push([item.module, item.passingRate.toFixed(1)]);
      });
    } else {
      // Student Growth
      summaryData.push([], ['Student Growth', '']);
      summaryData.push(['Date', 'New Students']);
      (data.curveChart || []).forEach((item) => {
        summaryData.push([item.day, item.total_users || 0]);
      });

      // Test Performance
      summaryData.push([], ['Test Performance', '']);
      summaryData.push(['Exam', 'Avg Passing Rate (%)']);
      (data.averagePassedStudents || []).forEach((item) => {
        summaryData.push([item.title || 'N/A', (item.avg_passed_students_per_exam * 100).toFixed(1)]);
      });
    }

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Dashboard Summary');

    // --- Tests Summary Sheet ---
    if (data.exams) {
      const testsSheet = data.exams
        .filter((test) => {
          // If a group is selected, only include tests with that group
          if (selectedGroup) {
            return test.groups?.some((g) => g.group_id === selectedGroup);
          }
          return true; // Include all tests if no group is selected
        })
        .map((test) => {
          const filteredGroups = selectedGroup
            ? test.groups?.filter((g) => g.group_id === selectedGroup) || []
            : test.groups || [];

          const totalUsers = filteredGroups.reduce((sum, g) => sum + (g.users?.length || 0), 0);
          const passCount = filteredGroups.reduce(
            (sum, g) => sum + (g.users?.filter((u) => u.status === 'pass').length || 0),
            0,
          );
          const failCount = filteredGroups.reduce(
            (sum, g) => sum + (g.users?.filter((u) => u.status === 'fail').length || 0),
            0,
          );
          const pendingCount = filteredGroups.reduce(
            (sum, g) => sum + (g.users?.filter((u) => !u.status).length || 0),
            0,
          );

          const moduleAverages = test.sections?.map((section) => {
            const totalUsers = filteredGroups.reduce((sum, g) => sum + (g.users?.length || 0), 0);
            const passedUsers = filteredGroups.reduce(
              (sum, g) =>
                sum +
                (g.users?.filter((u) =>
                  u.obtained?.some((o) => o.sectionId === section.id && o.status === 'pass')
                ).length || 0),
              0,
            );
            return `${section.name}: ${totalUsers ? Math.round((passedUsers / totalUsers) * 100) : 0}%`;
          }).join(', ');

          return {
            TestID: test.exam_id,
            Title: test.title,
            Status: test.status,
            StartDate: test.start_date,
            EndDate: test.end_date,
            MinMarks: test.min_marks || test.minMarks,
            TotalUsers: totalUsers,
            ModuleAverages: moduleAverages,
            Pass: passCount,
            Fail: failCount,
            Pending: pendingCount,
          };
        });

      const wsTests = XLSX.utils.json_to_sheet(testsSheet);
      XLSX.utils.book_append_sheet(wb, wsTests, 'Tests Summary');
    }

    // --- Save Excel ---
    const fileNameWithDate = selectedGroup
      ? `Group_${sanitizeSheetName(groupName)}_Dashboard_Summary_${format(new Date(), 'yyyy-MM-dd')}.xlsx`
      : `Dashboard_Summary_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
    XLSX.writeFile(wb, fileNameWithDate);
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleExport}
      disabled={disabled}
      sx={{ borderRadius: '8px' }}
    >
      Export to Excel
    </Button>
  );
};

export default ExportToExcelButton;