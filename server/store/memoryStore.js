const bcrypt = require('bcryptjs');

const initialDepartments = [
  { id: 'dept-1', name: 'Academic Affairs', description: 'Curriculum, lectures, and exams', headName: 'Dr. Robert Miller', active: true },
  { id: 'dept-2', name: 'Infrastructure & Facilities', description: 'Buildings, Wi-Fi, equipment', headName: 'Eng. Sarah Jenkins', active: true },
  { id: 'dept-3', name: 'Student Welfare & Services', description: 'Hostel, transport, student support', headName: 'Prof. David Vance', active: true },
  { id: 'dept-4', name: 'Canteen & Food Services', description: 'Food hygiene and dining facilities', headName: 'Mr. James Carter', active: true },
  { id: 'dept-5', name: 'Library & Learning Resources', description: 'Books, quiet study rooms, e-resources', headName: 'Mrs. Elena Rostova', active: true }
];

const initialCategories = [
  { id: 'cat-1', name: 'Academic', description: 'Coursework, faculty feedback, syllabus', color: '#3b82f6', active: true },
  { id: 'cat-2', name: 'Faculty', description: 'Teaching methods and guidance', color: '#6366f1', active: true },
  { id: 'cat-3', name: 'Infrastructure', description: 'Classrooms, labs, Wi-Fi, air conditioning', color: '#8b5cf6', active: true },
  { id: 'cat-4', name: 'Hostel', description: 'Dormitory amenities, maintenance, water', color: '#ec4899', active: true },
  { id: 'cat-5', name: 'Canteen', description: 'Food quality, hygiene, pricing', color: '#f59e0b', active: true },
  { id: 'cat-6', name: 'Transportation', description: 'Bus timing, routes, parking', color: '#10b981', active: true },
  { id: 'cat-7', name: 'Examination', description: 'Exam schedule, results, seating arrangement', color: '#ef4444', active: true },
  { id: 'cat-8', name: 'Library', description: 'Study spaces, book availability, opening hours', color: '#06b6d4', active: true },
  { id: 'cat-9', name: 'Student Services', description: 'Certificates, administration desk, ID cards', color: '#64748b', active: true },
  { id: 'cat-10', name: 'Other', description: 'General suggestions and non-classified items', color: '#94a3b8', active: true }
];

const initialSubmissions = [
  {
    id: 'sub-1',
    trackingId: 'ASP-2026-8F42K',
    type: 'Complaint',
    category: 'Canteen',
    priority: 'High',
    title: 'Canteen food quality needs immediate improvement',
    description: 'The food served in the main campus canteen during lunch today was undercooked and unhygienic. Multiple students felt unwell afterward. Please inspect food safety immediately.',
    attachment: null,
    status: 'In Progress',
    department: 'Canteen & Food Services',
    adminResponse: 'The health inspector and food committee have scheduled an immediate hygiene audit today at 2:00 PM.',
    sentiment: 'Negative',
    statusHistory: [
      { status: 'Submitted', date: new Date('2026-03-01T09:30:00Z'), note: 'Submission received anonymously.' },
      { status: 'Under Review', date: new Date('2026-03-01T10:15:00Z'), note: 'Reviewed by Dean of Student Affairs.' },
      { status: 'Assigned', date: new Date('2026-03-01T11:00:00Z'), note: 'Assigned to Canteen & Food Services department.' },
      { status: 'In Progress', date: new Date('2026-03-01T14:00:00Z'), note: 'Audit initiated with canteen staff.' }
    ],
    createdAt: new Date('2026-03-01T09:30:00Z'),
    updatedAt: new Date('2026-03-01T14:00:00Z')
  },
  {
    id: 'sub-2',
    trackingId: 'ASP-2026-3M91L',
    type: 'Complaint',
    category: 'Canteen',
    priority: 'High',
    title: 'Stale food and dirty utensils in dining area',
    description: 'Plates in the canteen are not washed properly with detergent. Water glasses had grease stains.',
    attachment: null,
    status: 'In Progress',
    department: 'Canteen & Food Services',
    adminResponse: 'Merged with ongoing inspection on canteen hygiene.',
    sentiment: 'Negative',
    statusHistory: [
      { status: 'Submitted', date: new Date('2026-03-01T11:20:00Z'), note: 'Submission received.' },
      { status: 'In Progress', date: new Date('2026-03-01T14:10:00Z'), note: 'Linked with primary canteen investigation.' }
    ],
    createdAt: new Date('2026-03-01T11:20:00Z'),
    updatedAt: new Date('2026-03-01T14:10:00Z')
  },
  {
    id: 'sub-3',
    trackingId: 'ASP-2026-7P20Q',
    type: 'Suggestion',
    category: 'Library',
    priority: 'Medium',
    title: 'Need more quiet study spaces and power outlets in the library',
    description: 'During mid-semester exam weeks, the 2nd-floor library desk space gets completely filled. Adding extra study pods and power outlets along the east wall would greatly help students preparing for exams.',
    attachment: null,
    status: 'Under Review',
    department: 'Library & Learning Resources',
    adminResponse: '',
    sentiment: 'Positive',
    statusHistory: [
      { status: 'Submitted', date: new Date('2026-03-02T14:00:00Z'), note: 'Submission received anonymously.' },
      { status: 'Under Review', date: new Date('2026-03-03T09:00:00Z'), note: 'Evaluating proposal with library administration.' }
    ],
    createdAt: new Date('2026-03-02T14:00:00Z'),
    updatedAt: new Date('2026-03-03T09:00:00Z')
  },
  {
    id: 'sub-4',
    trackingId: 'ASP-2026-9X14B',
    type: 'Complaint',
    category: 'Infrastructure',
    priority: 'High',
    title: 'Classroom projector broken in Block B Room 304',
    description: 'The ceiling projector in Block B Room 304 has an erratic HDMI display and keeps flickering off every 5 minutes during Computer Science lectures.',
    attachment: null,
    status: 'Pending',
    department: 'Infrastructure & Facilities',
    adminResponse: '',
    sentiment: 'Negative',
    statusHistory: [
      { status: 'Submitted', date: new Date('2026-03-04T08:15:00Z'), note: 'Submission logged.' }
    ],
    createdAt: new Date('2026-03-04T08:15:00Z'),
    updatedAt: new Date('2026-03-04T08:15:00Z')
  },
  {
    id: 'sub-5',
    trackingId: 'ASP-2026-5K88V',
    type: 'Concern',
    category: 'Infrastructure',
    priority: 'Critical',
    title: 'Exposed wire hazard near staircase of Engineering Block',
    description: 'There is an exposed electric wire near the 1st floor landing in the Engineering building staircase. It poses an immediate safety risk to students.',
    attachment: null,
    status: 'Pending',
    department: 'Infrastructure & Facilities',
    adminResponse: '',
    sentiment: 'Critical',
    statusHistory: [
      { status: 'Submitted', date: new Date('2026-03-05T07:45:00Z'), note: 'Logged as urgent safety concern.' }
    ],
    createdAt: new Date('2026-03-05T07:45:00Z'),
    updatedAt: new Date('2026-03-05T07:45:00Z')
  },
  {
    id: 'sub-6',
    trackingId: 'ASP-2026-2Y44W',
    type: 'Feedback',
    category: 'Academic',
    priority: 'Low',
    title: 'Appreciation for modern AI lab curriculum',
    description: 'The practical hands-on projects introduced in Machine Learning Lab this semester have been extremely practical and engaging. Thank you to the faculty.',
    attachment: null,
    status: 'Resolved',
    department: 'Academic Affairs',
    adminResponse: 'Thank you for your valuable feedback! We will forward this praise to the CS department head.',
    sentiment: 'Positive',
    statusHistory: [
      { status: 'Submitted', date: new Date('2026-02-15T10:00:00Z'), note: 'Submission received.' },
      { status: 'Under Review', date: new Date('2026-02-16T11:00:00Z'), note: 'Reviewed by department.' },
      { status: 'Resolved', date: new Date('2026-02-17T16:00:00Z'), note: 'Note shared with faculty.' }
    ],
    createdAt: new Date('2026-02-15T10:00:00Z'),
    updatedAt: new Date('2026-02-17T16:00:00Z')
  },
  {
    id: 'sub-7',
    trackingId: 'ASP-2026-4R11E',
    type: 'Suggestion',
    category: 'Hostel',
    priority: 'Medium',
    title: 'Request for better Wi-Fi bandwidth in Boys Hostel 2',
    description: 'Internet connectivity drops frequently after 8 PM in Boys Hostel Block 2. Upgrading access points would greatly aid late-night assignment submissions.',
    attachment: null,
    status: 'Assigned',
    department: 'Infrastructure & Facilities',
    adminResponse: 'IT Helpdesk has been notified to check signal strength and replace router AP #4.',
    sentiment: 'Neutral',
    statusHistory: [
      { status: 'Submitted', date: new Date('2026-02-28T21:00:00Z'), note: 'Logged.' },
      { status: 'Assigned', date: new Date('2026-03-01T09:00:00Z'), note: 'Dispatched to Campus Network Team.' }
    ],
    createdAt: new Date('2026-02-28T21:00:00Z'),
    updatedAt: new Date('2026-03-01T09:00:00Z')
  },
  {
    id: 'sub-8',
    trackingId: 'ASP-2026-1N66J',
    type: 'Complaint',
    category: 'Transportation',
    priority: 'Medium',
    title: 'Campus shuttle bus delays during morning peak hours',
    description: 'The 8:30 AM bus from North Gate to the Main Auditorium is constantly overcrowded and arrives 15 minutes late, causing students to miss attendance.',
    attachment: null,
    status: 'Resolved',
    department: 'Student Welfare & Services',
    adminResponse: 'An additional shuttle bus has been added on the North Gate route starting at 8:20 AM.',
    sentiment: 'Negative',
    statusHistory: [
      { status: 'Submitted', date: new Date('2026-02-20T09:00:00Z'), note: 'Received.' },
      { status: 'In Progress', date: new Date('2026-02-21T10:00:00Z'), note: 'Re-routing transport schedules.' },
      { status: 'Resolved', date: new Date('2026-02-25T12:00:00Z'), note: 'New shuttle operational.' }
    ],
    createdAt: new Date('2026-02-20T09:00:00Z'),
    updatedAt: new Date('2026-02-25T12:00:00Z')
  }
];

class MemoryStore {
  constructor() {
    this.departments = [...initialDepartments];
    this.categories = [...initialCategories];
    this.submissions = [...initialSubmissions];
    this.adminUser = {
      id: 'usr-admin-1',
      name: 'System Administrator',
      email: 'admin@college.edu',
      passwordHash: bcrypt.hashSync('Admin@123456', 10),
      role: 'admin'
    };
  }

  // Submissions
  getSubmissions() {
    return this.submissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getSubmissionByTrackingId(trackingId) {
    return this.submissions.find(s => s.trackingId.toUpperCase() === trackingId.toUpperCase().trim());
  }

  getSubmissionById(id) {
    return this.submissions.find(s => s.id === id || s._id === id);
  }

  createSubmission(data) {
    const newSubmission = {
      id: 'sub-' + Date.now(),
      _id: 'sub-' + Date.now(),
      trackingId: data.trackingId,
      type: data.type,
      category: data.category,
      priority: data.priority || 'Medium',
      title: data.title,
      description: data.description,
      attachment: data.attachment || null,
      status: 'Pending',
      department: data.department || 'General Administration',
      adminResponse: '',
      sentiment: data.sentiment || 'Neutral',
      statusHistory: [
        { status: 'Submitted', date: new Date(), note: 'Submission received anonymously.' }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.submissions.unshift(newSubmission);
    return newSubmission;
  }

  updateSubmission(id, updateData) {
    const sub = this.getSubmissionById(id);
    if (!sub) return null;

    if (updateData.status && updateData.status !== sub.status) {
      sub.status = updateData.status;
      sub.statusHistory.push({
        status: updateData.status,
        date: new Date(),
        note: updateData.statusNote || `Status updated to ${updateData.status}`
      });
    }

    if (updateData.adminResponse !== undefined) {
      sub.adminResponse = updateData.adminResponse;
    }

    if (updateData.priority) sub.priority = updateData.priority;
    if (updateData.department) sub.department = updateData.department;
    sub.updatedAt = new Date();

    return sub;
  }

  deleteSubmission(id) {
    const index = this.submissions.findIndex(s => s.id === id || s._id === id);
    if (index !== -1) {
      this.submissions.splice(index, 1);
      return true;
    }
    return false;
  }

  // Admin Auth
  async verifyAdminCredentials(email, password) {
    if (email.toLowerCase().trim() !== this.adminUser.email.toLowerCase()) {
      return null;
    }
    const match = await bcrypt.compare(password, this.adminUser.passwordHash);
    if (match) {
      return {
        id: this.adminUser.id,
        name: this.adminUser.name,
        email: this.adminUser.email,
        role: this.adminUser.role
      };
    }
    return null;
  }

  // Departments
  getDepartments() {
    return this.departments;
  }

  addDepartment(dept) {
    const newDept = { id: 'dept-' + Date.now(), ...dept, active: true };
    this.departments.push(newDept);
    return newDept;
  }

  updateDepartment(id, dept) {
    const item = this.departments.find(d => d.id === id);
    if (item) Object.assign(item, dept);
    return item;
  }

  deleteDepartment(id) {
    const idx = this.departments.findIndex(d => d.id === id);
    if (idx !== -1) {
      this.departments.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Categories
  getCategories() {
    return this.categories;
  }

  addCategory(cat) {
    const newCat = { id: 'cat-' + Date.now(), ...cat, active: true };
    this.categories.push(newCat);
    return newCat;
  }

  updateCategory(id, cat) {
    const item = this.categories.find(c => c.id === id);
    if (item) Object.assign(item, cat);
    return item;
  }

  deleteCategory(id) {
    const idx = this.categories.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.categories.splice(idx, 1);
      return true;
    }
    return false;
  }
}

const memoryStoreInstance = new MemoryStore();
module.exports = memoryStoreInstance;
