import React, { useState, useEffect } from 'react';
import { Plus, User, Calendar, TrendingUp, Bell, Download, Upload, AlertCircle, CheckCircle, Edit2, Trash2, X, Save, Camera, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Test definitions with parameters and reference ranges
const TEST_DEFINITIONS = {
  CBC: {
    name: "Complete Blood Count",
    category: "Hematology",
    parameters: {
      hemoglobin: { name: "Hemoglobin", unit: "g/dL", male: [13.5, 17.5], female: [12.0, 15.5] },
      rbc: { name: "RBC Count", unit: "million/μL", male: [4.5, 5.9], female: [4.1, 5.1] },
      wbc: { name: "WBC Count", unit: "thousand/μL", normal: [4.0, 11.0] },
      platelets: { name: "Platelets", unit: "thousand/μL", normal: [150, 400] },
      hematocrit: { name: "Hematocrit", unit: "%", male: [38.8, 50.0], female: [34.9, 44.5] },
      mcv: { name: "MCV", unit: "fL", normal: [80, 100] },
      mch: { name: "MCH", unit: "pg", normal: [27, 33] },
      mchc: { name: "MCHC", unit: "g/dL", normal: [32, 36] }
    }
  },
  LFT: {
    name: "Liver Function Test",
    category: "Biochemistry",
    parameters: {
      sgot: { name: "SGOT/AST", unit: "U/L", normal: [5, 40] },
      sgpt: { name: "SGPT/ALT", unit: "U/L", normal: [7, 56] },
      totalBilirubin: { name: "Total Bilirubin", unit: "mg/dL", normal: [0.3, 1.2] },
      directBilirubin: { name: "Direct Bilirubin", unit: "mg/dL", normal: [0.0, 0.3] },
      indirectBilirubin: { name: "Indirect Bilirubin", unit: "mg/dL", normal: [0.2, 0.9] },
      alkalinePhosphatase: { name: "Alkaline Phosphatase", unit: "U/L", normal: [44, 147] },
      totalProtein: { name: "Total Protein", unit: "g/dL", normal: [6.0, 8.3] },
      albumin: { name: "Albumin", unit: "g/dL", normal: [3.5, 5.5] },
      globulin: { name: "Globulin", unit: "g/dL", normal: [2.0, 3.5] },
      agRatio: { name: "A/G Ratio", unit: "", normal: [1.0, 2.5] }
    }
  },
  KFT: {
    name: "Kidney Function Test",
    category: "Biochemistry",
    parameters: {
      urea: { name: "Urea", unit: "mg/dL", normal: [15, 40] },
      creatinine: { name: "Creatinine", unit: "mg/dL", male: [0.7, 1.3], female: [0.6, 1.1] },
      uricAcid: { name: "Uric Acid", unit: "mg/dL", male: [3.4, 7.0], female: [2.4, 6.0] },
      bun: { name: "BUN", unit: "mg/dL", normal: [7, 20] },
      sodium: { name: "Sodium", unit: "mEq/L", normal: [136, 145] },
      potassium: { name: "Potassium", unit: "mEq/L", normal: [3.5, 5.0] },
      chloride: { name: "Chloride", unit: "mEq/L", normal: [96, 106] },
      calcium: { name: "Calcium", unit: "mg/dL", normal: [8.5, 10.5] }
    }
  },
  LIPID: {
    name: "Lipid Profile",
    category: "Biochemistry",
    parameters: {
      totalCholesterol: { name: "Total Cholesterol", unit: "mg/dL", normal: [0, 200] },
      ldl: { name: "LDL Cholesterol", unit: "mg/dL", normal: [0, 100] },
      hdl: { name: "HDL Cholesterol", unit: "mg/dL", male: [40, 60], female: [50, 60] },
      vldl: { name: "VLDL Cholesterol", unit: "mg/dL", normal: [2, 30] },
      triglycerides: { name: "Triglycerides", unit: "mg/dL", normal: [0, 150] },
      tcHdlRatio: { name: "TC/HDL Ratio", unit: "", normal: [0, 5] },
      ldlHdlRatio: { name: "LDL/HDL Ratio", unit: "", normal: [0, 3] }
    }
  },
  THYROID: {
    name: "Thyroid Profile",
    category: "Endocrinology",
    parameters: {
      t3: { name: "T3", unit: "ng/dL", normal: [80, 200] },
      t4: { name: "T4", unit: "μg/dL", normal: [4.5, 12.0] },
      tsh: { name: "TSH", unit: "μIU/mL", normal: [0.4, 4.0] },
      freeT3: { name: "Free T3", unit: "pg/mL", normal: [2.0, 4.4] },
      freeT4: { name: "Free T4", unit: "ng/dL", normal: [0.8, 1.8] }
    }
  },
  BLOOD_SUGAR: {
    name: "Blood Sugar",
    category: "Biochemistry",
    parameters: {
      fasting: { name: "Fasting Blood Sugar", unit: "mg/dL", normal: [70, 100] },
      random: { name: "Random Blood Sugar", unit: "mg/dL", normal: [70, 140] },
      postPrandial: { name: "Post Prandial", unit: "mg/dL", normal: [70, 140] },
      hba1c: { name: "HbA1c", unit: "%", normal: [4.0, 5.6] }
    }
  },
  BLOOD_PRESSURE: {
    name: "Blood Pressure",
    category: "Vitals",
    parameters: {
      systolic: { name: "Systolic BP", unit: "mmHg", normal: [90, 120] },
      diastolic: { name: "Diastolic BP", unit: "mmHg", normal: [60, 80] },
      pulseRate: { name: "Pulse Rate", unit: "bpm", normal: [60, 100] }
    }
  },
  BODY_METRICS: {
    name: "Body Metrics",
    category: "Physical",
    parameters: {
      weight: { name: "Weight", unit: "kg", normal: [40, 120] },
      height: { name: "Height", unit: "cm", normal: [140, 200] },
      bmi: { name: "BMI", unit: "kg/m²", normal: [18.5, 24.9] },
      bodyFat: { name: "Body Fat %", unit: "%", male: [8, 24], female: [21, 35] }
    }
  },
  VITAMINS: {
    name: "Vitamin Profile",
    category: "Biochemistry",
    parameters: {
      vitaminD: { name: "Vitamin D", unit: "ng/mL", normal: [30, 100] },
      vitaminB12: { name: "Vitamin B12", unit: "pg/mL", normal: [200, 900] },
      folicAcid: { name: "Folic Acid", unit: "ng/mL", normal: [2.7, 17.0] },
      iron: { name: "Iron", unit: "μg/dL", male: [65, 176], female: [50, 170] },
      ferritin: { name: "Ferritin", unit: "ng/mL", male: [24, 336], female: [11, 307] }
    }
  },
  OTHER: {
    name: "Other Tests",
    category: "General",
    parameters: {
      esr: { name: "ESR", unit: "mm/hr", male: [0, 15], female: [0, 20] },
      crp: { name: "CRP", unit: "mg/L", normal: [0, 10] }
    }
  }
};

const App = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [activeMemberId, setActiveMemberId] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddTest, setShowAddTest] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [testData, setTestData] = useState({});
  const [reminders, setReminders] = useState([]);
  const [showReminders, setShowReminders] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    if (familyMembers.length === 0) {
      setShowAddMember(true);
    }
  }, [familyMembers.length]);

  const addFamilyMember = (member) => {
    const newMember = {
      id: Date.now().toString(),
      ...member,
      tests: [],
      createdAt: new Date().toISOString()
    };
    setFamilyMembers([...familyMembers, newMember]);
    setActiveMemberId(newMember.id);
    setShowAddMember(false);
  };

  const updateFamilyMember = (id, updates) => {
    setFamilyMembers(familyMembers.map(m => m.id === id ? { ...m, ...updates } : m));
    setEditingMember(null);
  };

  const deleteFamilyMember = (id) => {
    if (window.confirm('Are you sure you want to delete this member and all their test data?')) {
      setFamilyMembers(familyMembers.filter(m => m.id !== id));
      if (activeMemberId === id) {
        setActiveMemberId(familyMembers[0]?.id || null);
      }
    }
  };

  const addTest = (testType, date, values, report) => {
    const member = familyMembers.find(m => m.id === activeMemberId);
    if (!member) return;

    const newTest = {
      id: Date.now().toString(),
      type: testType,
      date: date,
      values: values,
      report: report,
      createdAt: new Date().toISOString()
    };

    const updatedMember = {
      ...member,
      tests: [...(member.tests || []), newTest]
    };

    setFamilyMembers(familyMembers.map(m => m.id === activeMemberId ? updatedMember : m));
    setShowAddTest(false);
    setSelectedTest(null);
    setTestData({});
  };

  const deleteTest = (testId) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      const member = familyMembers.find(m => m.id === activeMemberId);
      const updatedMember = {
        ...member,
        tests: member.tests.filter(t => t.id !== testId)
      };
      setFamilyMembers(familyMembers.map(m => m.id === activeMemberId ? updatedMember : m));
    }
  };

  const addReminder = (reminder) => {
    setReminders([...reminders, { ...reminder, id: Date.now().toString() }]);
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const exportData = () => {
    const data = {
      familyMembers,
      reminders,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-monitor-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.familyMembers) setFamilyMembers(data.familyMembers);
        if (data.reminders) setReminders(data.reminders);
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const activeMember = familyMembers.find(m => m.id === activeMemberId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-indigo-600">Personal Health Monitor</h1>
              <p className="text-sm text-gray-600">of Biplab Bawali</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowReminders(!showReminders)}
                className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 relative"
              >
                <Bell className="w-5 h-5" />
                {reminders.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {reminders.length}
                  </span>
                )}
              </button>
              <button onClick={exportData} className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200">
                <Download className="w-5 h-5" />
              </button>
              <label className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 cursor-pointer">
                <Upload className="w-5 h-5" />
                <input type="file" accept=".json" onChange={importData} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </header>

      {familyMembers.length > 0 && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-3 overflow-x-auto">
              {familyMembers.map(member => (
                <button
                  key={member.id}
                  onClick={() => setActiveMemberId(member.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    activeMemberId === member.id
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium">{member.name}</span>
                </button>
              ))}
              <button
                onClick={() => setShowAddMember(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Add Member</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6">
        {!activeMember ? (
          <EmptyState onAddMember={() => setShowAddMember(true)} />
        ) : (
          <>
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  currentView === 'dashboard' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('history')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  currentView === 'history' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Test History
              </button>
              <button
                onClick={() => setCurrentView('trends')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  currentView === 'trends' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Trends
              </button>
              <button
                onClick={() => setCurrentView('profile')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  currentView === 'profile' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Profile
              </button>
            </div>

            {currentView === 'dashboard' && (
              <Dashboard member={activeMember} onAddTest={() => setShowAddTest(true)} />
            )}
            {currentView === 'history' && (
              <TestHistory member={activeMember} onDeleteTest={deleteTest} />
            )}
            {currentView === 'trends' && <TrendsView member={activeMember} />}
            {currentView === 'profile' && (
              <ProfileView 
                member={activeMember} 
                onEdit={() => setEditingMember(activeMember)}
                onDelete={() => deleteFamilyMember(activeMember.id)}
              />
            )}
          </>
        )}
      </main>

      {showAddMember && (
        <AddMemberModal
          onClose={() => setShowAddMember(false)}
          onAdd={addFamilyMember}
        />
      )}
      {showAddTest && (
        <AddTestModal
          onClose={() => {
            setShowAddTest(false);
            setSelectedTest(null);
            setTestData({});
          }}
          onAdd={addTest}
          member={activeMember}
        />
      )}
      {showReminders && (
        <RemindersPanel
          reminders={reminders}
          onClose={() => setShowReminders(false)}
          onAdd={addReminder}
          onDelete={deleteReminder}
        />
      )}
      {editingMember && (
        <EditMemberModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onUpdate={updateFamilyMember}
        />
      )}
    </div>
  );
};

const EmptyState = ({ onAddMember }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg shadow-md p-8">
    <User className="w-20 h-20 text-gray-300 mb-4" />
    <h2 className="text-2xl font-bold text-gray-700 mb-2">Welcome to Health Monitor</h2>
    <p className="text-gray-500 mb-6 text-center">Get started by adding your first family member</p>
    <button
      onClick={onAddMember}
      className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
    >
      <Plus className="w-5 h-5" />
      Add Family Member
    </button>
  </div>
);

const Dashboard = ({ member, onAddTest }) => {
  const recentTests = (member.tests || []).slice(-5).reverse();
  const testCounts = {};
  (member.tests || []).forEach(test => {
    testCounts[test.type] = (testCounts[test.type] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Tests</p>
              <p className="text-3xl font-bold text-indigo-600">{member.tests?.length || 0}</p>
            </div>
            <FileText className="w-12 h-12 text-indigo-200" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Test Types</p>
              <p className="text-3xl font-bold text-green-600">{Object.keys(testCounts).length}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-200" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Last Test</p>
              <p className="text-lg font-bold text-blue-600">
                {recentTests[0] ? new Date(recentTests[0].date).toLocaleDateString() : 'No tests yet'}
              </p>
            </div>
            <Calendar className="w-12 h-12 text-blue-200" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <button
          onClick={onAddTest}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add New Test
        </button>
      </div>

      {recentTests.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Tests</h2>
          <div className="space-y-3">
            {recentTests.map(test => (
              <div key={test.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{TEST_DEFINITIONS[test.type]?.name}</p>
                  <p className="text-sm text-gray-500">{new Date(test.date).toLocaleDateString()}</p>
                </div>
                <span className="text-xs px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full">
                  {Object.keys(test.values).length} parameters
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TestHistory = ({ member, onDeleteTest }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  let tests = [...(member.tests || [])];

  if (filter !== 'all') {
    tests = tests.filter(t => t.type === filter);
  }

  tests.sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
    return 0;
  });

  const testTypes = [...new Set((member.tests || []).map(t => t.type))];

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-md flex gap-4 flex-wrap">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Tests</option>
          {testTypes.map(type => (
            <option key={type} value={type}>{TEST_DEFINITIONS[type]?.name}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
        </select>
      </div>

      <div className="space-y-4">
        {tests.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-500">No tests found</p>
          </div>
        ) : (
          tests.map(test => (
            <TestCard key={test.id} test={test} member={member} onDelete={onDeleteTest} />
          ))
        )}
      </div>
    </div>
  );
};

const TestCard = ({ test, member, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const testDef = TEST_DEFINITIONS[test.type];

  const getStatus = (paramKey, value) => {
    const param = testDef.parameters[paramKey];
    if (!param || !value) return 'normal';

    let range = param.normal;
    if (param.male && member.gender === 'male') range = param.male;
    if (param.female && member.gender === 'female') range = param.female;

    if (!range) return 'normal';

    const numValue = parseFloat(value);
    if (numValue < range[0] || numValue > range[1]) return 'abnormal';
    return 'normal';
  };

  const abnormalCount = Object.keys(test.values).filter(key => 
    getStatus(key, test.values[key]) === 'abnormal'
  ).length;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-gray-800">{testDef?.name}</h3>
            {abnormalCount > 0 && (
              <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">
                {abnormalCount} abnormal
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{new Date(test.date).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(test.id);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(test.values).map(([key, value]) => {
              const param = testDef.parameters[key];
              const status = getStatus(key, value);
              let range = param?.normal;
              if (param?.male && member.gender === 'male') range = param.male;
              if (param?.female && member.gender === 'female') range = param.female;

              return (
                <div key={key} className={`p-3 rounded-lg ${status === 'abnormal' ? 'bg-red-50' : 'bg-white'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{param?.name}</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        {value} <span className="text-sm text-gray-500">{param?.unit}</span>
                      </p>
                      {range && (
                        <p className="text-xs text-gray-500 mt-1">
                          Normal: {range[0]} - {range[1]} {param?.unit}
                        </p>
                      )}
                    </div>
                    {status === 'abnormal' && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {test.report && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Attached Report:</p>
              <img src={test.report} alt="Test Report" className="max-w-full rounded-lg shadow-md" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TrendsView = ({ member }) => {
  const [selectedTest, setSelectedTest] = useState('');
  const [selectedParam, setSelectedParam] = useState('');

  const testTypes = [...new Set((member.tests || []).map(t => t.type))];

  useEffect(() => {
    if (testTypes.length > 0 && !selectedTest) {
      setSelectedTest(testTypes[0]);
    }
  }, [testTypes, selectedTest]);

  useEffect(() => {
    if (selectedTest) {
      const testDef = TEST_DEFINITIONS[selectedTest];
      const params = Object.keys(testDef?.parameters || {});
      if (params.length > 0 && !selectedParam) {
        setSelectedParam(params[0]);
      }
    }
  }, [selectedTest, selectedParam]);

  const chartData = member.tests
    ?.filter(t => t.type === selectedTest && t.values[selectedParam])
    .map(t => ({
      date: new Date(t.date).toLocaleDateString(),
      value: parseFloat(t.values[selectedParam]),
      timestamp: new Date(t.date).getTime()
    }))
    .sort((a, b) => a.timestamp - b.timestamp) || [];

  const testDef = TEST_DEFINITIONS[selectedTest];
  const paramDef = testDef?.parameters[selectedParam];
  let range = paramDef?.normal;
  if (paramDef?.male && member.gender === 'male') range = paramDef.male;
  if (paramDef?.female && member.gender === 'female') range = paramDef.female;

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Test</label>
            <select
              value={selectedTest}
              onChange={(e) => {
                setSelectedTest(e.target.value);
                setSelectedParam('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {testTypes.map(type => (
                <option key={type} value={type}>{TEST_DEFINITIONS[type]?.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Parameter</label>
            <select
              value={selectedParam}
              onChange={(e) => setSelectedParam(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.entries(testDef?.parameters || {}).map(([key, param]) => (
                <option key={key} value={key}>{param.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            {paramDef?.name} Trend
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {range && (
                <>
                  <Line type="monotone" dataKey={() => range[0]} stroke="#10b981" strokeDasharray="5 5" name="Min Normal" dot={false} />
                  <Line type="monotone" dataKey={() => range[1]} stroke="#10b981" strokeDasharray="5 5" name="Max Normal" dot={false} />
                </>
              )}
              <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} name={paramDef?.name} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-500">No data available for the selected parameter</p>
        </div>
      )}
    </div>
  );
};

const ProfileView = ({ member, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-indigo-600 text-4xl font-bold">
            {member.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-3xl font-bold">{member.name}</h2>
            <p className="text-indigo-100">{member.age} years • {member.gender}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
            <p className="text-lg text-gray-800">{member.dob || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Blood Group</label>
            <p className="text-lg text-gray-800">{member.bloodGroup || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Total Tests</label>
            <p className="text-lg text-gray-800">{member.tests?.length || 0}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
            <p className="text-lg text-gray-800">{new Date(member.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Delete Profile
          </button>
        </div>
      </div>
    </div>
  );
};

const AddMemberModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    dob: '',
    gender: 'male',
    bloodGroup: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.gender) {
      alert('Please fill in all required fields');
      return;
    }
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Add Family Member</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
            <select
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              Add Member
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditMemberModal = ({ member, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: member.name,
    age: member.age,
    dob: member.dob || '',
    gender: member.gender,
    bloodGroup: member.bloodGroup || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(member.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
            <select
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddTestModal = ({ onClose, onAdd, member }) => {
  const [selectedTestType, setSelectedTestType] = useState('');
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [values, setValues] = useState({});
  const [report, setReport] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setReport(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTestType || Object.keys(values).length === 0) {
      alert('Please select a test type and enter at least one value');
      return;
    }
    onAdd(selectedTestType, testDate, values, report);
  };

  const testDef = TEST_DEFINITIONS[selectedTestType];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">Add New Test</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Type *</label>
              <select
                value={selectedTestType}
                onChange={(e) => {
                  setSelectedTestType(e.target.value);
                  setValues({});
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select Test Type</option>
                {Object.entries(TEST_DEFINITIONS).map(([key, test]) => (
                  <option key={key} value={key}>{test.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Date *</label>
              <input
                type="date"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {testDef && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Test Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(testDef.parameters).map(([key, param]) => {
                  let range = param.normal;
                  if (param.male && member.gender === 'male') range = param.male;
                  if (param.female && member.gender === 'female') range = param.female;

                  const value = values[key];
                  let status = 'normal';
                  if (value && range) {
                    const numValue = parseFloat(value);
                    if (numValue < range[0] || numValue > range[1]) status = 'abnormal';
                  }

                  return (
                    <div key={key} className={`p-4 rounded-lg border-2 ${status === 'abnormal' ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {param.name}
                        {status === 'abnormal' && (
                          <span className="ml-2 text-xs text-red-600">⚠ Out of range</span>
                        )}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="any"
                          value={values[key] || ''}
                          onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Enter value"
                        />
                        <span className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 flex items-center">
                          {param.unit}
                        </span>
                      </div>
                      {range && (
                        <p className="text-xs text-gray-500 mt-1">
                          Normal: {range[0]} - {range[1]} {param.unit}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Test Report (Optional)</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {report && (
              <div className="mt-4">
                <p className="text-sm text-green-600 mb-2">✓ Report uploaded</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              Save Test
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RemindersPanel = ({ reminders, onClose, onAdd, onDelete }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    testName: '',
    date: '',
    frequency: 'one-time',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ testName: '', date: '', frequency: 'one-time', notes: '' });
    setShowAddForm(false);
  };

  const isUpcoming = (date) => new Date(date) >= new Date();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">Test Reminders</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Reminder
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
                <input
                  type="text"
                  value={formData.testName}
                  onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="one-time">One Time</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {reminders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No reminders set
              </div>
            ) : (
              reminders.map(reminder => (
                <div
                  key={reminder.id}
                  className={`p-4 rounded-lg border-2 ${
                    isUpcoming(reminder.date) ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{reminder.testName}</h4>
                      <p className="text-sm text-gray-600">{new Date(reminder.date).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500 mt-1 capitalize">{reminder.frequency}</p>
                      {!isUpcoming(reminder.date) && (
                        <span className="text-xs text-red-600 font-medium">Overdue</span>
                      )}
                    </div>
                    <button
                      onClick={() => onDelete(reminder.id)}
                      className="text-red-600 hover:bg-red-100 p-2 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
