const { z } = require('zod');
const rateLimit = require('express-rate-limit');

/**
 * Express middleware to validate request body against a Zod schema
 * @param {z.ZodSchema} schema 
 */
function validate(schema) {
  return (req, res, next) => {
    try {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        const errorMessages = parsed.error.issues.map(
          issue => `${issue.path.join('.')}: ${issue.message}`
        );
        return res.status(400).json({
          success: false,
          message: 'Validation failed: ' + errorMessages.join('; '),
          errors: parsed.error.issues
        });
      }
      req.validatedBody = parsed.data;
      next();
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request body format: ' + err.message
      });
    }
  };
}

// -------------------------------------------------------------
// Rate Limiters
// -------------------------------------------------------------
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts from this IP. Please try again after 15 minutes.'
  }
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 registrations per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many accounts created from this IP. Please try again after an hour.'
  }
});

// -------------------------------------------------------------
// Zod Schemas
// -------------------------------------------------------------

// Auth Schemas
const loginSchema = z.object({
  emailOrRoll: z.string().min(1, 'Email or Roll Number is required'),
  password: z.string().min(1, 'Password is required')
});

const adminLoginSchema = z.object({
  emailOrRoll: z.string().optional(),
  email: z.string().optional(),
  password: z.string().min(1, 'Password is required')
}).refine(data => data.emailOrRoll || data.email, {
  message: 'Email or Username is required'
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  roll: z.string().min(3, 'Roll number must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  branch: z.string().optional().default('Data Science & AI'),
  year: z.string().optional().default('1st Year'),
  semester: z.string().optional().default('Semester 2'),
  cgpa: z.string().optional().default('8.0'),
  avatar: z.string().optional()
});

// Timetable Slot Schema
const timetableSlotSchema = z.object({
  branch: z.string().optional().default('Data Science & AI'),
  day: z.string().min(1, 'Day is required'),
  time: z.string().optional(),
  time_slot: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  room: z.string().optional(),
  type: z.string().optional(),
  slot_type: z.string().optional()
}).refine(data => data.time || data.time_slot, {
  message: 'Time slot is required'
});

// Resource Schema
const resourceSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  type: z.string().optional().default('Notes'),
  semester: z.string().optional().default('Sem 1'),
  unit: z.string().optional().default('Unit 1-4'),
  link: z.string().min(1, 'Link/URL is required'),
  description: z.string().optional(),
  authorName: z.string().optional()
});

// Assignment Schema
const assignmentSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  dueDate: z.string().optional(),
  due_date: z.string().optional(),
  priority: z.string().optional().default('Medium'),
  status: z.string().optional().default('Pending'),
  description: z.string().optional(),
  faculty: z.string().optional()
}).refine(data => data.dueDate || data.due_date, {
  message: 'Due date is required'
});

// Exam Schema
const examSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  examDate: z.string().optional(),
  exam_date: z.string().optional(),
  examTime: z.string().optional(),
  exam_time: z.string().optional(),
  room: z.string().optional(),
  syllabus: z.string().optional()
}).refine(data => data.examDate || data.exam_date, {
  message: 'Exam date is required'
});

// Announcement Schema
const announcementSchema = z.object({
  title: z.string().min(3, 'Announcement title must be at least 3 characters'),
  body: z.string().min(5, 'Announcement body must be at least 5 characters'),
  category: z.string().optional().default('Academic'),
  urgent: z.union([z.boolean(), z.number()]).optional().default(false),
  author: z.string().optional(),
  date: z.string().optional()
});

// Campus Event Schema
const eventSchema = z.object({
  title: z.string().min(3, 'Event title must be at least 3 characters'),
  date: z.string().optional(),
  date_str: z.string().optional(),
  venue: z.string().min(2, 'Venue is required'),
  category: z.string().optional().default('Hackathon'),
  desc: z.string().optional(),
  description: z.string().optional(),
  badgeColor: z.string().optional(),
  banner: z.string().optional()
}).refine(data => data.date || data.date_str, {
  message: 'Event date is required'
});

// Exchange Listing Schema
const exchangeListingSchema = z.object({
  type: z.enum(['sell', 'lost', 'found'], {
    errorMap: () => ({ message: "Type must be one of: 'sell', 'lost', 'found'" })
  }),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  category: z.string().optional().default('General'),
  price: z.string().optional(),
  location: z.string().optional(),
  image_url: z.string().optional(),
  contact_pref: z.string().optional().default('In-App Message')
});

// Mess Feedback Schema
const messFeedbackSchema = z.object({
  mealType: z.string().min(1, 'Meal type is required'),
  rating: z.union([z.number(), z.string()]).refine(val => {
    const num = Number(val);
    return !isNaN(num) && num >= 1 && num <= 5;
  }, { message: 'Rating must be a number between 1 and 5' }),
  comment: z.string().optional(),
  studentRoll: z.string().optional(),
  studentName: z.string().optional()
});

// Mess Menu Update Schema
const messMenuSchema = z.object({
  breakfast: z.string().optional(),
  lunch: z.string().optional(),
  snacks: z.string().optional(),
  dinner: z.string().optional(),
  note: z.string().optional()
});

// Admin User Creation Schema
const userCreateSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  role: z.enum(['admin', 'student'], {
    errorMap: () => ({ message: "Role must be 'admin' or 'student'" })
  }),
  roll: z.string().optional(),
  branch: z.string().optional(),
  year: z.string().optional(),
  semester: z.string().optional(),
  cgpa: z.string().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  avatar: z.string().optional()
});

// Admin User Update Schema
const userUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(4).optional(),
  role: z.enum(['admin', 'student']).optional(),
  roll: z.string().optional(),
  branch: z.string().optional(),
  year: z.string().optional(),
  semester: z.string().optional(),
  cgpa: z.string().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  avatar: z.string().optional()
});

module.exports = {
  validate,
  loginLimiter,
  registerLimiter,
  loginSchema,
  adminLoginSchema,
  registerSchema,
  timetableSlotSchema,
  resourceSchema,
  assignmentSchema,
  examSchema,
  announcementSchema,
  eventSchema,
  exchangeListingSchema,
  messFeedbackSchema,
  messMenuSchema,
  userCreateSchema,
  userUpdateSchema
};
