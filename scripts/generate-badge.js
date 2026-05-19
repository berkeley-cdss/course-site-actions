const fs = require('fs');

let reportPath = 'axe-report.json';
if (!fs.existsSync(reportPath)) {
  reportPath = '_build/html/axe-report.json';
}

if (!fs.existsSync(reportPath)) {
  console.log('No axe-report.json found in root or _build/html/ directory.');
  process.exit(0);
}

const data = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

let violationsCount = 0;
let incompleteCount = 0;

data.forEach(page => {
  if (page.violations) {
    violationsCount += page.violations.reduce((sum, rule) => sum + rule.nodes.length, 0);
  }
  if (page.incomplete) {
    incompleteCount += page.incomplete.reduce((sum, rule) => sum + rule.nodes.length, 0);
  }
});

let color = 'success';
if (violationsCount > 0) color = 'red';
else if (incompleteCount > 0) color = 'yellow';

let msg = [];
if (violationsCount > 0) msg.push(violationsCount + ' violations');
if (incompleteCount > 0) msg.push(incompleteCount + ' issues');
if (msg.length === 0) msg.push('passed');

const badge = {
  schemaVersion: 1,
  label: 'a11y',
  message: msg.join(', '),
  color: color,
  cacheSeconds: 60
};

fs.writeFileSync('a11y-badge.json', JSON.stringify(badge, null, 2));
console.log('Successfully generated a11y-badge.json: ' + badge.message);
