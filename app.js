/**
 * Student Campus Hub - IIIT-NR (Naya Raipur)
 * Core Application Logic, State Management & Interactivity
 */

// ==========================================
// 1. INITIAL DATA STORES & SEED DATA
// ==========================================

const DEFAULT_ADMIN = {
  id: 'admin_001',
  role: 'admin',
  name: 'Revanth',
  email: 'revanth0246@gmail.com',
  designation: 'Chief Administrator',
  department: 'Office of Academic Affairs, IIIT-NR',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces'
};

const DEFAULT_STUDENTS = [
  {
    "id": "student_001",
    "role": "student",
    "roll": "24DSAI001",
    "name": "Sahil Pulipaka",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "7.8",
    "email": "sahil@iiitnr.ac.in",
    "batch": "2024 - 2028",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
    "password": "student123"
  },
  {
    "id": "student_002",
    "role": "student",
    "roll": "24CSE015",
    "name": "Aarav Sharma",
    "branch": "Computer Science & Engineering",
    "year": "2nd Year",
    "semester": "Semester 4",
    "cgpa": "8.6",
    "email": "aarav24@iiitnr.ac.in",
    "batch": "2024 - 2028",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
    "password": "student123"
  },
  {
    "id": "student_003",
    "role": "student",
    "roll": "24ECE042",
    "name": "Priya Verma",
    "branch": "Electronics & Communication",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.8",
    "email": "priya24@iiitnr.ac.in",
    "batch": "2024 - 2028",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
    "password": "student123"
  },
  {
    "id": "student_261020401",
    "role": "student",
    "roll": "261020401",
    "name": "Aarav Agrawal",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020401@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020402",
    "role": "student",
    "roll": "261020402",
    "name": "Aarya Srivastava",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020402@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020403",
    "role": "student",
    "roll": "261020403",
    "name": "Aastha Kanwar",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020403@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020404",
    "role": "student",
    "roll": "261020404",
    "name": "Abhinav Bisen",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020404@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020405",
    "role": "student",
    "roll": "261020405",
    "name": "Abhinav Chauhan",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020405@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020406",
    "role": "student",
    "roll": "261020406",
    "name": "Abhinav Tyagi",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020406@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020407",
    "role": "student",
    "roll": "261020407",
    "name": "Abhisek Karmakar",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020407@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020408",
    "role": "student",
    "roll": "261020408",
    "name": "Adarsh Ojha",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020408@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020409",
    "role": "student",
    "roll": "261020409",
    "name": "Aditya Kumar Saha",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020409@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020410",
    "role": "student",
    "roll": "261020410",
    "name": "Agrim Thakur",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020410@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020411",
    "role": "student",
    "roll": "261020411",
    "name": "Akash Sharma",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020411@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020412",
    "role": "student",
    "roll": "261020412",
    "name": "Akriti Agrawal",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020412@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020413",
    "role": "student",
    "roll": "261020413",
    "name": "Amitash Ravindra Shetty",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020413@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020414",
    "role": "student",
    "roll": "261020414",
    "name": "Ankit Saini",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020414@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020415",
    "role": "student",
    "roll": "261020415",
    "name": "Anshaj Kumar Yadav",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020415@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020416",
    "role": "student",
    "roll": "261020416",
    "name": "Apoorv Singh",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020416@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020417",
    "role": "student",
    "roll": "261020417",
    "name": "Arijit Singh",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020417@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020418",
    "role": "student",
    "roll": "261020418",
    "name": "Aruni Agrawal",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020418@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020419",
    "role": "student",
    "roll": "261020419",
    "name": "Ashutosh Mukherjee",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020419@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020420",
    "role": "student",
    "roll": "261020420",
    "name": "Atharva Yadav",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020420@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020421",
    "role": "student",
    "roll": "261020421",
    "name": "Avanish Kesharwani",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020421@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020422",
    "role": "student",
    "roll": "261020422",
    "name": "Ayanna Jain",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020422@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020423",
    "role": "student",
    "roll": "261020423",
    "name": "Ayush Kowachi",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020423@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020424",
    "role": "student",
    "roll": "261020424",
    "name": "Ayush Kumar Singh",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020424@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020425",
    "role": "student",
    "roll": "261020425",
    "name": "Ayush Pandey",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020425@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020426",
    "role": "student",
    "roll": "261020426",
    "name": "Charan Teja Pedhapelli",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020426@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020427",
    "role": "student",
    "roll": "261020427",
    "name": "Chesta Kamle",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020427@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020428",
    "role": "student",
    "roll": "261020428",
    "name": "Coral Rai",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020428@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020429",
    "role": "student",
    "roll": "261020429",
    "name": "Debabrata Mukherjee",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020429@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020430",
    "role": "student",
    "roll": "261020430",
    "name": "Deepak Kumar Dewangan",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020430@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020431",
    "role": "student",
    "roll": "261020431",
    "name": "Dev Shukla",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020431@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020432",
    "role": "student",
    "roll": "261020432",
    "name": "Dharmendra Kumar",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020432@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020433",
    "role": "student",
    "roll": "261020433",
    "name": "Dharti Gautam",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020433@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020434",
    "role": "student",
    "roll": "261020434",
    "name": "Doopati Revanth Raju",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020434@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020435",
    "role": "student",
    "roll": "261020435",
    "name": "Dyutirisha Pal",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020435@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020436",
    "role": "student",
    "roll": "261020436",
    "name": "Geetank Khursenga",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020436@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020437",
    "role": "student",
    "roll": "261020437",
    "name": "Girish Kumar Kanwar",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020437@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020438",
    "role": "student",
    "roll": "261020438",
    "name": "Gourav Thory",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020438@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020439",
    "role": "student",
    "roll": "261020439",
    "name": "Gyanendra Kumar Kamdi",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020439@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020440",
    "role": "student",
    "roll": "261020440",
    "name": "Hanumanthu Kiran Aditya",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020440@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020441",
    "role": "student",
    "roll": "261020441",
    "name": "Harshit Singh",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020441@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020442",
    "role": "student",
    "roll": "261020442",
    "name": "Himanshu Ranjan",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020442@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020443",
    "role": "student",
    "roll": "261020443",
    "name": "Himanshu Shalikram Bhiwgade",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020443@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020444",
    "role": "student",
    "roll": "261020444",
    "name": "Hritika Kesharwani",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020444@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020445",
    "role": "student",
    "roll": "261020445",
    "name": "Jaiyesh Ekka",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020445@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020446",
    "role": "student",
    "roll": "261020446",
    "name": "Kavya Chandrakar",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020446@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020447",
    "role": "student",
    "roll": "261020447",
    "name": "Kolli Bhuvanakruthi",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020447@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020448",
    "role": "student",
    "roll": "261020448",
    "name": "Kumar Sahil",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020448@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020449",
    "role": "student",
    "roll": "261020449",
    "name": "Kumkum Samrath",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020449@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020450",
    "role": "student",
    "roll": "261020450",
    "name": "Kunj Patel",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020450@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020451",
    "role": "student",
    "roll": "261020451",
    "name": "Lakshyaraj Singh",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020451@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020452",
    "role": "student",
    "roll": "261020452",
    "name": "Lavanya Diwakar",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020452@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020453",
    "role": "student",
    "roll": "261020453",
    "name": "Madhav",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020453@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020454",
    "role": "student",
    "roll": "261020454",
    "name": "Manideep Sharma",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020454@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020455",
    "role": "student",
    "roll": "261020455",
    "name": "Marella Tejaswini",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020455@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020456",
    "role": "student",
    "roll": "261020456",
    "name": "Marisetti Namish Sri Sai Shishir",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020456@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020457",
    "role": "student",
    "roll": "261020457",
    "name": "Mohit Dharmesh Shah",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020457@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020458",
    "role": "student",
    "roll": "261020458",
    "name": "Mohit Singh",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020458@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020459",
    "role": "student",
    "roll": "261020459",
    "name": "Muthi Rishi Venkat",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020459@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020460",
    "role": "student",
    "roll": "261020460",
    "name": "Naman Meshram",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020460@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020461",
    "role": "student",
    "roll": "261020461",
    "name": "Navneet Chelak",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020461@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020462",
    "role": "student",
    "roll": "261020462",
    "name": "Nilanshi Singh",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020462@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020463",
    "role": "student",
    "roll": "261020463",
    "name": "Nilesh Singh",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020463@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020464",
    "role": "student",
    "roll": "261020464",
    "name": "Nirpekshita",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020464@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020465",
    "role": "student",
    "roll": "261020465",
    "name": "Paarij Patil",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020465@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020466",
    "role": "student",
    "roll": "261020466",
    "name": "Parth Meharchandani",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020466@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020467",
    "role": "student",
    "roll": "261020467",
    "name": "Parth Sharma",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020467@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020468",
    "role": "student",
    "roll": "261020468",
    "name": "Prakash Agrawal",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020468@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020469",
    "role": "student",
    "roll": "261020469",
    "name": "Prerna Tirkey",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020469@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020470",
    "role": "student",
    "roll": "261020470",
    "name": "Prince Kumar",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020470@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020471",
    "role": "student",
    "roll": "261020471",
    "name": "Punit Gupta",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020471@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020472",
    "role": "student",
    "roll": "261020472",
    "name": "Raghav Agarwal",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020472@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020473",
    "role": "student",
    "roll": "261020473",
    "name": "Rakesh Singh Sardar",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020473@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020474",
    "role": "student",
    "roll": "261020474",
    "name": "Rishabh Kumar",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020474@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020475",
    "role": "student",
    "roll": "261020475",
    "name": "Rohan Kumar Meher",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020475@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020476",
    "role": "student",
    "roll": "261020476",
    "name": "Sahil Banjare",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020476@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020477",
    "role": "student",
    "roll": "261020477",
    "name": "Samarth Santosh Khedkar",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020477@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020478",
    "role": "student",
    "roll": "261020478",
    "name": "Saniya Parveen",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020478@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020479",
    "role": "student",
    "roll": "261020479",
    "name": "Sanskriti Patre",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020479@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020480",
    "role": "student",
    "roll": "261020480",
    "name": "Satwik Sankrityayan",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020480@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020481",
    "role": "student",
    "roll": "261020481",
    "name": "Shambhavi Sharaff",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020481@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020482",
    "role": "student",
    "roll": "261020482",
    "name": "Shaurya Agarwal",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020482@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020483",
    "role": "student",
    "roll": "261020483",
    "name": "Shaurya Jain",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020483@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020484",
    "role": "student",
    "roll": "261020484",
    "name": "Shreya Dewangan",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020484@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020485",
    "role": "student",
    "roll": "261020485",
    "name": "Shreyashi Pandey",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020485@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020486",
    "role": "student",
    "roll": "261020486",
    "name": "Shruti Deokar",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020486@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020487",
    "role": "student",
    "roll": "261020487",
    "name": "Sovanya Jethanandani",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020487@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020488",
    "role": "student",
    "roll": "261020488",
    "name": "Sridhar Sekhar Patro",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020488@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020489",
    "role": "student",
    "roll": "261020489",
    "name": "Sufal Singh Thakur",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020489@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020490",
    "role": "student",
    "roll": "261020490",
    "name": "Sujal Dewangan",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020490@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020491",
    "role": "student",
    "roll": "261020491",
    "name": "Swami Shivling Dhanraj",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020491@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020492",
    "role": "student",
    "roll": "261020492",
    "name": "Sweksha Agrahari",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020492@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020493",
    "role": "student",
    "roll": "261020493",
    "name": "Utsav Shori",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020493@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020494",
    "role": "student",
    "roll": "261020494",
    "name": "Vansh Singhal",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020494@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020495",
    "role": "student",
    "roll": "261020495",
    "name": "Vedansh Uraon",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020495@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020496",
    "role": "student",
    "roll": "261020496",
    "name": "Veeravalli Bala Surya Chandra",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020496@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020497",
    "role": "student",
    "roll": "261020497",
    "name": "Vinukonda Hima Satya Lakshmi Nehal",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020497@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020498",
    "role": "student",
    "roll": "261020498",
    "name": "Vivek Kumar Sahu",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020498@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020499",
    "role": "student",
    "roll": "261020499",
    "name": "Yagyesh Kudiyam",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020499@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  },
  {
    "id": "student_261020500",
    "role": "student",
    "roll": "261020500",
    "name": "Yashvardhan Raj",
    "branch": "Data Science & AI",
    "year": "1st Year",
    "semester": "Semester 1",
    "cgpa": "8.0",
    "email": "261020500@iiitnr.edu.in",
    "batch": "2026 - 2030",
    "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces",
    "password": "Test@1234"
  }
];

// Slot descriptions & official full subject names
const SLOT_DESCRIPTIONS = {
  'A': 'Slot A: Mathematics-I (Calculus & Linear Algebra)',
  'B': 'Slot B: Computer Programming (C & Python)',
  'C': 'Slot C: Digital Logic & Computer Organization',
  'F': 'Slot F: Engineering Physics',
  'G': 'Slot G: Professional Communication & English',
  'M': 'Slot M: IT Workshop & Engineering Mechanics',
  'N': 'Slot N: Discrete Mathematics & Intro to AI',
  'ILC': 'Indian Languages & Culture (ILC)',
  'Music': 'Creative Arts: Music',
  'Yoga': 'Health & Wellness: Yoga',
  'ILC/Yoga': 'ILC / Yoga Session',
  'L': 'Lunch Break (1:00 PM - 2:00 PM)',
  'U': 'Lunch Break (1:00 PM - 2:00 PM)',
  'H': 'Lunch Break (1:00 PM - 2:00 PM)',
  'Lunch': 'Lunch Break (1:00 PM - 2:00 PM)'
};

const TIMETABLE_PERIODS = [
  '9:00 - 9:55',
  '10:00 - 10:55',
  '11:00 - 11:55',
  '12:00 - 12:55',
  '1:00 - 2:00',
  '02:00 - 02:55',
  '03:00 - 03:55',
  '04:00 - 04:55',
  '05:00 - 05:55'
];

function getSlotType(code) {
  if (!code) return 'free';
  const c = code.toUpperCase().trim();
  if (c === 'A' || c.startsWith('A') || c.includes('SLOT A')) return 'a';
  if (c === 'B' || c.startsWith('B') || c.includes('SLOT B')) return 'b';
  if (c === 'C' || c.startsWith('C') || c.includes('SLOT C')) return 'c';
  if (c === 'F' || c.startsWith('F') || c.includes('SLOT F')) return 'f';
  if (c === 'G' || c.startsWith('G') || c.includes('SLOT G')) return 'g';
  if (c === 'M' || c.startsWith('M') || c.includes('SLOT M')) return 'm';
  if (c === 'N' || c.startsWith('N') || c.includes('SLOT N')) return 'n';
  if (c.includes('MUSIC')) return 'music';
  if (c.includes('ILC') && c.includes('YOGA')) return 'yoga';
  if (c.includes('ILC')) return 'ilc';
  if (c.includes('YOGA')) return 'yoga';
  if (c === 'L' || c === 'U' || c === 'H' || c.includes('LUNCH')) return 'lunch';
  if (c === '-' || c.includes('FREE')) return 'free';
  return 'm';
}

const DEFAULT_RESOURCES = [
  {
    id: 'res_1',
    subject: 'Slot A (Mathematics)',
    title: 'Calculus, Matrices & Linear Algebra Complete Lecture Notes',
    type: 'Notes',
    semester: 'Sem 1',
    link: 'https://drive.google.com/drive/folders/slot-a-maths-iiitnr',
    notesCount: 16,
    papersCount: 8,
    contributor: 'Admin / Dept. of Mathematics',
    date: '02 Oct 2026',
    description: 'Eigenvalues, Cayley-Hamilton theorem, Multivariable calculus, and past mid-sem test solutions.'
  },
  {
    id: 'res_2',
    subject: 'Slot B (Computer Programming)',
    title: 'Problem Solving with C & Python Programming PYQ Bank',
    type: 'Previous Papers',
    semester: 'Sem 1',
    link: 'https://drive.google.com/drive/folders/slot-b-programming-pyq',
    notesCount: 12,
    papersCount: 10,
    contributor: 'Admin / Dept. of CSE',
    date: '28 Sep 2026',
    description: 'Pointers, dynamic memory allocation, file handling, recursion, and lab test coding problems.'
  },
  {
    id: 'res_3',
    subject: 'Slot C (Digital Logic)',
    title: 'Digital Electronics, Boolean Algebra & K-Maps Cheatsheet',
    type: 'Important Links',
    semester: 'Sem 1',
    link: 'https://github.com/iiitnr-students/slot-c-digital-logic',
    notesCount: 10,
    papersCount: 6,
    contributor: 'Admin / Academic Cell',
    date: '22 Sep 2026',
    description: 'Combinational logic design, Multiplexers, Decoders, Flip-Flops, and circuit simulation templates.'
  },
  {
    id: 'res_4',
    subject: 'Slot F (Physics)',
    title: 'Engineering Physics & Electromagnetics Study Package',
    type: 'Notes',
    semester: 'Sem 1',
    link: 'https://drive.google.com/drive/folders/slot-f-physics-notes',
    notesCount: 14,
    papersCount: 5,
    contributor: 'Admin / Faculty of Physics',
    date: '19 Sep 2026',
    description: 'Quantum mechanics basics, laser physics, fiber optics, and Maxwell equations derivation.'
  },
  {
    id: 'res_5',
    subject: 'Slot G (Professional Communication)',
    title: 'Technical Report Writing & Phonetics Guide',
    type: 'Notes',
    semester: 'Sem 1',
    link: 'https://drive.google.com/drive/folders/slot-g-comm-skills',
    notesCount: 8,
    papersCount: 4,
    contributor: 'Admin / Humanities & Languages Cell',
    date: '15 Sep 2026',
    description: 'Presentation skills, formal correspondence, interview readiness, and spoken english modules.'
  },
  {
    id: 'res_6',
    subject: 'Slot M (IT Workshop)',
    title: 'Linux CLI Commands, Git & Hardware Assembly Manual',
    type: 'Important Links',
    semester: 'Sem 1',
    link: 'https://github.com/iiitnr-students/it-workshop-manual',
    notesCount: 9,
    papersCount: 3,
    contributor: 'Admin / Computer Center Team',
    date: '12 Sep 2026',
    description: 'Bash scripting, version control workflows with GitHub, LaTeX document typesetting, and PC troubleshooting.'
  },
  {
    id: 'res_7',
    subject: 'Slot N (Discrete Mathematics / AI)',
    title: 'Set Theory, Graph Theory & Propositional Logic Modules',
    type: 'Notes',
    semester: 'Sem 1',
    link: 'https://drive.google.com/drive/folders/slot-n-discrete-maths',
    notesCount: 15,
    papersCount: 7,
    contributor: 'Admin / Dept. of Data Science & AI',
    date: '08 Sep 2026',
    description: 'Relations, functions, recurrence relations, tree traversal algorithms, and proof techniques.'
  }
];

// Official Timetables for All 3 Branches (w.e.f. 24/08/2026 | IIIT Naya Raipur)
const DEFAULT_BRANCH_TIMETABLES = {
  'Data Science & AI': [
    {
      day: 'Monday',
      periods: {
        '9:00 - 9:55': { subject: 'Music', room: '203', type: 'music' },
        '10:00 - 10:55': { subject: 'Music', room: '203', type: 'music' },
        '11:00 - 11:55': { subject: 'C', room: '203', type: 'c' },
        '12:00 - 12:55': { subject: 'C', room: '203', type: 'c' },
        '1:00 - 2:00': { subject: 'L', room: 'Mess', type: 'lunch' },
        '02:00 - 02:55': { subject: 'ILC', room: '203', type: 'ilc' },
        '03:00 - 03:55': { subject: 'F', room: '203', type: 'f' },
        '04:00 - 04:55': { subject: 'ILC/Yoga', room: '203', type: 'yoga' },
        '05:00 - 05:55': { subject: 'ILC/Yoga', room: '203', type: 'yoga' }
      }
    },
    {
      day: 'Tuesday',
      periods: {
        '9:00 - 9:55': { subject: 'M', room: '203', type: 'm' },
        '10:00 - 10:55': { subject: 'A', room: '203', type: 'a' },
        '11:00 - 11:55': { subject: 'A', room: '203', type: 'a' },
        '12:00 - 12:55': { subject: '-', room: '-', type: 'free' },
        '1:00 - 2:00': { subject: 'U', room: 'Mess', type: 'lunch' },
        '02:00 - 02:55': { subject: 'F', room: '203', type: 'f' },
        '03:00 - 03:55': { subject: 'F', room: '203', type: 'f' },
        '04:00 - 04:55': { subject: 'B', room: '203', type: 'b' },
        '05:00 - 05:55': { subject: 'B', room: '203', type: 'b' }
      }
    },
    {
      day: 'Wednesday',
      periods: {
        '9:00 - 9:55': { subject: 'ILC', room: '203', type: 'ilc' },
        '10:00 - 10:55': { subject: 'G', room: '203', type: 'g' },
        '11:00 - 11:55': { subject: 'B', room: '203', type: 'b' },
        '12:00 - 12:55': { subject: 'N', room: '203', type: 'n' },
        '1:00 - 2:00': { subject: 'N', room: 'Mess', type: 'lunch' },
        '02:00 - 02:55': { subject: 'ILC', room: '203', type: 'ilc' },
        '03:00 - 03:55': { subject: 'ILC', room: '203', type: 'ilc' },
        '04:00 - 04:55': { subject: 'Music', room: '203', type: 'music' },
        '05:00 - 05:55': { subject: 'Music', room: '203', type: 'music' }
      }
    },
    {
      day: 'Thursday',
      periods: {
        '9:00 - 9:55': { subject: 'G', room: '203', type: 'g' },
        '10:00 - 10:55': { subject: 'G', room: '203', type: 'g' },
        '11:00 - 11:55': { subject: 'M', room: '203', type: 'm' },
        '12:00 - 12:55': { subject: 'C', room: '203', type: 'c' },
        '1:00 - 2:00': { subject: 'C', room: 'Mess', type: 'lunch' },
        '02:00 - 02:55': { subject: 'M', room: '203', type: 'm' },
        '03:00 - 03:55': { subject: 'M', room: '203', type: 'm' },
        '04:00 - 04:55': { subject: 'N', room: '203', type: 'n' },
        '05:00 - 05:55': { subject: 'B', room: '203', type: 'b' }
      }
    },
    {
      day: 'Friday',
      periods: {
        '9:00 - 9:55': { subject: 'N', room: '203', type: 'n' },
        '10:00 - 10:55': { subject: 'N', room: '203', type: 'n' },
        '11:00 - 11:55': { subject: 'C', room: '203', type: 'c' },
        '12:00 - 12:55': { subject: 'F', room: '203', type: 'f' },
        '1:00 - 2:00': { subject: 'H', room: 'Mess', type: 'lunch' },
        '02:00 - 02:55': { subject: '-', room: '-', type: 'free' },
        '03:00 - 03:55': { subject: '-', room: '-', type: 'free' },
        '04:00 - 04:55': { subject: 'Yoga', room: 'Ground', type: 'yoga' },
        '05:00 - 05:55': { subject: 'Yoga', room: 'Ground', type: 'yoga' }
      }
    }
  ],
  'Computer Science & Engineering': [
    {
      day: 'Monday',
      periods: {
        '9:00 - 9:55': { subject: 'Slot A (Data Structures)', room: '201', type: 'a' },
        '10:00 - 10:55': { subject: 'Slot B (OOP with Java)', room: '201', type: 'b' },
        '11:00 - 11:55': { subject: 'Slot C (Discrete Maths)', room: '201', type: 'c' },
        '12:00 - 12:55': { subject: 'Slot M (Comp Org & Arch)', room: '201', type: 'm' },
        '1:00 - 2:00': { subject: 'L', room: 'Mess', type: 'lunch' },
        '02:00 - 02:55': { subject: 'Slot F (Operating Systems)', room: '201', type: 'f' },
        '03:00 - 03:55': { subject: 'Slot G (Theory of Comp)', room: '201', type: 'g' },
        '04:00 - 04:55': { subject: 'Slot B (Web Tech Lab)', room: 'CC Lab 1', type: 'b' },
        '05:00 - 05:55': { subject: 'Free / Coding Club', room: 'CC Lab 1', type: 'free' }
      }
    },
    {
      day: 'Tuesday',
      periods: {
        '9:00 - 9:55': { subject: 'Slot B (OOP with Java)', room: '201', type: 'b' },
        '10:00 - 10:55': { subject: 'Slot C (Discrete Maths)', room: '201', type: 'c' },
        '11:00 - 11:55': { subject: 'Slot A (Data Structures)', room: '201', type: 'a' },
        '12:00 - 12:55': { subject: 'Slot F (Operating Systems)', room: '201', type: 'f' },
        '1:00 - 2:00': { subject: 'U', room: 'Mess', type: 'lunch' },
        '02:00 - 02:55': { subject: 'Health & Wellness: Yoga', room: 'Sports Complex', type: 'yoga' },
        '03:00 - 03:55': { subject: 'Slot M (Comp Org & Arch)', room: '201', type: 'm' },
        '04:00 - 04:55': { subject: 'Slot G (Theory of Comp)', room: '201', type: 'g' },
        '05:00 - 05:55': { subject: 'Free / Self Study', room: '-', type: 'free' }
      }
    },
    {
      day: 'Wednesday',
      periods: {
        '9:00 - 9:55': { subject: 'Slot C (Discrete Maths)', room: '201', type: 'c' },
        '10:00 - 10:55': { subject: 'Slot A (Data Structures)', room: '201', type: 'a' },
        '11:00 - 11:55': { subject: 'Slot B (OOP with Java)', room: '201', type: 'b' },
        '12:00 - 12:55': { subject: 'Slot G (Technical Comm)', room: '201', type: 'g' },
        '1:00 - 2:00': { subject: 'N', room: 'Mess', type: 'lunch' },
        '02:00 - 02:55': { subject: 'Slot N (Database / SQL)', room: 'CC Lab 2', type: 'n' },
        '03:00 - 03:55': { subject: 'Slot M (Comp Org & Arch)', room: '201', type: 'm' },
        '04:00 - 04:55': { subject: 'Slot F (Operating Systems)', room: '201', type: 'f' },
        '05:00 - 05:55': { subject: 'Free Study Hour', room: '-', type: 'free' }
      }
    },
    {
      day: 'Thursday',
      periods: {
        '9:00 - 9:55': { subject: 'Slot F (Operating Systems)', room: '201', type: 'f' },
        '10:00 - 10:55': { subject: 'Slot G (Technical Comm)', room: '201', type: 'g' },
        '11:00 - 11:55': { subject: 'Slot M (Comp Org & Arch)', room: '201', type: 'm' },
        '12:00 - 12:55': { subject: 'Slot N (Database / SQL)', room: 'CC Lab 2', type: 'n' },
        '1:00 - 2:00': { subject: 'C', room: 'Mess', type: 'lunch' },
        '02:00 - 02:55': { subject: 'Indian Lang & Culture (ILC)', room: '201', type: 'ilc' },
        '03:00 - 03:55': { subject: 'Slot A (Data Structures)', room: '201', type: 'a' },
        '04:00 - 04:55': { subject: 'Slot B (OOP with Java)', room: '201', type: 'b' },
        '05:00 - 05:55': { subject: 'Slot C (Discrete Maths)', room: '201', type: 'c' }
      }
    },
    {
      day: 'Friday',
      periods: {
        '9:00 - 9:55': { subject: 'Slot G (Theory of Comp)', room: '201', type: 'g' },
        '10:00 - 10:55': { subject: 'Slot M (Comp Org & Arch)', room: '201', type: 'm' },
        '11:00 - 11:55': { subject: 'Slot N (Database / SQL)', room: 'CC Lab 2', type: 'n' },
        '12:00 - 12:55': { subject: 'Slot A (Data Structures)', room: '201', type: 'a' },
        '1:00 - 2:00': { subject: 'H', room: 'Mess', type: 'lunch' },
        '02:00 - 02:55': { subject: 'Creative Arts: Music', room: 'Auditorium', type: 'music' },
        '03:00 - 03:55': { subject: 'Slot B (OOP with Java)', room: '201', type: 'b' },
        '04:00 - 04:55': { subject: 'Slot C (Discrete Maths)', room: '201', type: 'c' },
        '05:00 - 05:55': { subject: 'Slot F (OS Project Lab)', room: 'CC Lab 2', type: 'f' }
      }
    }
  ],
  'Electronics & Communication': [
    {
      day: 'Monday',
      periods: {
        '9:00 - 9:55': { subject: 'Slot A (Maths & Transforms)', room: '205', type: 'a' },
        '10:00 - 10:55': { subject: 'Slot B (Devices & Circuits)', room: '205', type: 'b' },
        '11:00 - 11:55': { subject: 'Slot C (Digital Circuits & uP)', room: '205', type: 'c' },
        '12:00 - 12:55': { subject: 'Slot M (Hardware Lab)', room: 'Hardware Lab', type: 'm' },
        '1:00 - 2:00': { subject: 'L', room: 'Mess', type: 'lunch' },
        '02:00 - 02:55': { subject: 'Creative Arts: Music', room: 'Auditorium', type: 'music' },
        '03:00 - 03:55': { subject: 'Slot F (Signals & Systems)', room: '205', type: 'f' },
        '04:00 - 04:55': { subject: 'Slot G (Electromagnetic Fields)', room: '205', type: 'g' },
        '05:00 - 05:55': { subject: 'Free / Robotics Lab', room: 'Hardware Lab', type: 'free' }
      }
    },
    {
      day: 'Tuesday',
      periods: {
        '9:00 - 9:55': { subject: 'Slot B (Devices & Circuits)', room: '205', type: 'b' },
        '10:00 - 10:55': { subject: 'Slot C (Digital Circuits & uP)', room: '205', type: 'c' },
        '11:00 - 11:55': { subject: 'Slot A (Maths & Transforms)', room: '205', type: 'a' },
        '12:00 - 12:55': { subject: 'Slot F (Signals & Systems)', room: '205', type: 'f' },
        '1:00 - 2:00': { subject: 'U', room: 'Mess', type: 'lunch' },
        '02:00 - 02:55': { subject: 'Health & Wellness: Yoga', room: 'Sports Complex', type: 'yoga' },
        '03:00 - 03:55': { subject: 'Slot G (Electromagnetic Fields)', room: '205', type: 'g' },
        '04:00 - 04:55': { subject: 'Slot M (Circuit Sim Lab)', room: 'VLSI Lab', type: 'm' },
        '05:00 - 05:55': { subject: 'Free / Mentorship', room: '-', type: 'free' }
      }
    },
    {
      day: 'Wednesday',
      periods: {
        '9:00 - 9:55': { subject: 'Slot C (Digital Circuits & uP)', room: '205', type: 'c' },
        '10:00 - 10:55': { subject: 'Slot A (Maths & Transforms)', room: '205', type: 'a' },
        '11:00 - 11:55': { subject: 'Slot B (Devices & Circuits)', room: '205', type: 'b' },
        '12:00 - 12:55': { subject: 'Slot G (Electromagnetic Fields)', room: '205', type: 'g' },
        '1:00 - 2:00': { subject: 'N', room: 'Mess', type: 'lunch' },
        '02:00 - 02:55': { subject: 'Slot N (Comm Systems)', room: '205', type: 'n' },
        '03:00 - 03:55': { subject: 'Slot M (Hardware Lab)', room: 'Hardware Lab', type: 'm' },
        '04:00 - 04:55': { subject: 'Slot F (Signals & Systems)', room: '205', type: 'f' },
        '05:00 - 05:55': { subject: 'Free Study Hour', room: '-', type: 'free' }
      }
    },
    {
      day: 'Thursday',
      periods: {
        '9:00 - 9:55': { subject: 'Slot F (Signals & Systems)', room: '205', type: 'f' },
        '10:00 - 10:55': { subject: 'Slot G (Electromagnetic Fields)', room: '205', type: 'g' },
        '11:00 - 11:55': { subject: 'Slot M (Hardware Lab)', room: 'Hardware Lab', type: 'm' },
        '12:00 - 12:55': { subject: 'Slot N (Comm Systems)', room: '205', type: 'n' },
        '1:00 - 2:00': { subject: 'C', room: 'Mess', type: 'lunch' },
        '02:00 - 02:55': { subject: 'Indian Lang & Culture (ILC)', room: '205', type: 'ilc' },
        '03:00 - 03:55': { subject: 'Slot A (Maths & Transforms)', room: '205', type: 'a' },
        '04:00 - 04:55': { subject: 'Slot B (Devices & Circuits)', room: '205', type: 'b' },
        '05:00 - 05:55': { subject: 'Slot C (Digital Circuits & uP)', room: '205', type: 'c' }
      }
    },
    {
      day: 'Friday',
      periods: {
        '9:00 - 9:55': { subject: 'Slot G (Electromagnetic Fields)', room: '205', type: 'g' },
        '10:00 - 10:55': { subject: 'Slot M (Hardware Lab)', room: 'Hardware Lab', type: 'm' },
        '11:00 - 11:55': { subject: 'Slot N (Comm Systems)', room: '205', type: 'n' },
        '12:00 - 12:55': { subject: 'Slot A (Maths & Transforms)', room: '205', type: 'a' },
        '1:00 - 2:00': { subject: 'H', room: 'Mess', type: 'lunch' },
        '02:00 - 02:55': { subject: 'Creative Arts / Yoga', room: 'Campus Hall', type: 'yoga' },
        '03:00 - 03:55': { subject: 'Slot B (Devices & Circuits)', room: '205', type: 'b' },
        '04:00 - 04:55': { subject: 'Slot C (Digital Circuits & uP)', room: '205', type: 'c' },
        '05:00 - 05:55': { subject: 'Slot F (Signals Lab)', room: 'Hardware Lab', type: 'f' }
      }
    }
  ]
};

const DEFAULT_TIMETABLE = DEFAULT_BRANCH_TIMETABLES['Data Science & AI'];

// Initial Global Assignments mapped to official subjects
const DEFAULT_GLOBAL_ASSIGNMENTS = [
  {
    id: 'asgn_g1',
    subject: 'Slot C (Digital Logic)',
    title: 'Boolean Minimization & 4-bit ALU Circuit Design',
    dueDate: '2026-09-28',
    isBroadcast: true,
    createdBy: 'Admin / Dr. P. Rao (Digital Lab)',
    createdRole: 'admin',
    completedBy: []
  },
  {
    id: 'asgn_g2',
    subject: 'Slot B (Computer Programming)',
    title: 'Pointers & Dynamic Memory Allocation in C',
    dueDate: '2026-09-30',
    isBroadcast: true,
    createdBy: 'Admin / Prof. V. K. (CSE)',
    createdRole: 'admin',
    completedBy: ['24DSAI001']
  },
  {
    id: 'asgn_g3',
    subject: 'Slot A (Mathematics)',
    title: 'Eigenvalues & Diagonalization Problem Set 3',
    dueDate: '2026-10-02',
    isBroadcast: true,
    createdBy: 'Admin / Dept. of Mathematics',
    createdRole: 'admin',
    completedBy: []
  },
  {
    id: 'asgn_g4',
    subject: 'Slot F (Physics)',
    title: 'Interference & Diffraction Numerical Sheet',
    dueDate: '2026-10-05',
    isBroadcast: true,
    createdBy: 'Admin / Faculty of Physics',
    createdRole: 'admin',
    completedBy: []
  },
  {
    id: 'asgn_g5',
    subject: 'Slot M (IT Workshop)',
    title: 'Linux Shell Scripting & Git Collaboration Lab',
    dueDate: '2026-10-08',
    isBroadcast: true,
    createdBy: 'Admin / IT Workshop Incharge',
    createdRole: 'admin',
    completedBy: []
  }
];

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 'ann_1',
    title: 'Mid-Semester Exams Notification',
    body: 'Exams begin from 10 October 2026. Be prepared and check the detailed timetable on the academic notice board and portal.',
    date: '20 Sep 2026',
    category: 'Exams',
    urgent: true,
    author: 'Dean Academic Office'
  },
  {
    id: 'ann_2',
    title: 'Hackathon Registration Open',
    body: 'Registration closes on 5 October 2026. High cash rewards and mentoring by top tech leads. Don\'t miss this opportunity!',
    date: '18 Sep 2026',
    category: 'Events',
    urgent: false,
    author: 'Tech Club IIIT-NR'
  },
  {
    id: 'ann_3',
    title: 'Assignment Submission Deadline',
    body: 'DBMS assignment due on 28 September 2026 before 11:59 PM. Submit on time to avoid late grading penalties.',
    date: '16 Sep 2026',
    category: 'Academic',
    urgent: false,
    author: 'DBMS Course Instructor'
  },
  {
    id: 'ann_4',
    title: 'Library Hours Extended',
    body: 'The central library will remain open till 10:00 PM from 20 Sep to 30 Sep 2026 for continuous mid-term exam preparation.',
    date: '14 Sep 2026',
    category: 'Hostel & Facilities',
    urgent: false,
    author: 'Chief Librarian'
  }
];

const DEFAULT_EVENTS = [
  {
    id: 'ev_1',
    title: 'College Hackathon 2026',
    date: '25 September 2026',
    venue: 'Main Auditorium & CC Labs',
    desc: '36-Hour National Level Hackathon featuring Web3, AI, and IoT tracks with top industry judges.',
    registered: false,
    badgeColor: 'bg-indigo-600',
    banner: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'ev_2',
    title: 'Inter-College Sports Day',
    date: '30 September 2026',
    venue: 'Sports Ground & Indoor Complex',
    desc: 'Athletics, Football, Cricket, Badminton and Basketball tournaments across all batches.',
    registered: true,
    badgeColor: 'bg-emerald-600',
    banner: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'ev_3',
    title: 'Cultural Fest - Aarohan',
    date: '15 October 2026',
    venue: 'College Amphitheatre & Lawns',
    desc: 'Music nights, dance competitions, dramatic plays, and celebrity artist live performance.',
    registered: false,
    badgeColor: 'bg-rose-600',
    banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=80'
  }
];

const DEFAULT_EXAMS = [
  {
    id: 'exam_1',
    subject: 'Slot A (Mathematics)',
    title: 'Calculus, Matrices & Linear Algebra Mid-Term Exam',
    examDate: '2026-10-10',
    examTime: '10:00 AM - 01:00 PM',
    room: 'Room 203',
    syllabus: 'Eigenvalues & Eigenvectors, Cayley-Hamilton theorem, Multivariable calculus, Partial derivatives, Jacobians.',
    createdBy: 'Admin / Dept. of Mathematics'
  },
  {
    id: 'exam_2',
    subject: 'Slot B (Computer Programming)',
    title: 'Problem Solving with C & Python Mid-Term Exam',
    examDate: '2026-10-12',
    examTime: '10:00 AM - 01:00 PM',
    room: 'Room 203 & CC Lab',
    syllabus: 'Pointers and address arithmetic, Dynamic memory allocation (malloc/calloc), Recursion, Structures, File I/O.',
    createdBy: 'Admin / Dept. of CSE'
  },
  {
    id: 'exam_3',
    subject: 'Slot C (Digital Logic)',
    title: 'Digital Electronics & Logic Design Mid-Term Exam',
    examDate: '2026-10-14',
    examTime: '10:00 AM - 01:00 PM',
    room: 'Room 203',
    syllabus: 'Karnaugh Maps minimization, Combinational logic (Adders, Multiplexers, Decoders), Sequential logic, Flip-Flops.',
    createdBy: 'Admin / Academic Affairs'
  },
  {
    id: 'exam_4',
    subject: 'Slot F (Physics)',
    title: 'Engineering Physics & Electromagnetics Theory Exam',
    examDate: '2026-10-16',
    examTime: '10:00 AM - 01:00 PM',
    room: 'Room 203',
    syllabus: 'Wave optics (Interference & Diffraction), Maxwell electromagnetic equations, Lasers and Fiber optics.',
    createdBy: 'Admin / Faculty of Physics'
  },
  {
    id: 'exam_5',
    subject: 'Slot N (Discrete Mathematics)',
    title: 'Discrete Mathematics & Logic Mid-Term Exam',
    examDate: '2026-10-18',
    examTime: '10:00 AM - 01:00 PM',
    room: 'Room 203',
    syllabus: 'Propositional & Predicate logic, Graph theory, Tree traversals, Recurrence relations, Proof by induction.',
    createdBy: 'Admin / Academic Affairs'
  }
];

const DEFAULT_MESS = [
  {
    day: 'Monday',
    breakfast: 'Idli, Sambar, Coconut Chutney, Bread Butter, Tea / Coffee',
    lunch: 'Paneer Butter Masala, Dal Tadka, Jeera Rice, Chapati, Fresh Salad',
    snacks: 'Veg Cutlet, Mint Chutney, Hot Masala Tea',
    dinner: 'Aloo Gobi Matar, Mix Dal, Steamed Basmati Rice, Phulka, Gulab Jamun',
    note: 'South Indian Breakfast & Evening Special'
  },
  {
    day: 'Tuesday',
    breakfast: 'Poha with Sev & Fried Peanuts, Boiled Sprouts, Banana, Milk / Tea',
    lunch: 'Rajma Masala, Steamed Rice, Phulka, Boondi Raita, Roasted Papad',
    snacks: 'Samosa, Tamarind Chutney, Ginger Tea',
    dinner: 'Kadai Chicken / Shahi Paneer, Dal Makhani, Pulao, Tandoori Roti, Kheer',
    note: 'Special North Indian Delicacy Day'
  },
  {
    day: 'Wednesday',
    breakfast: 'Methi Paratha, Fresh Curd, Mixed Pickle, Boiled Eggs / Banana, Tea',
    lunch: 'Chole Bhature / Chole Rice, Yellow Moong Dal, Onion Salad, Curd',
    snacks: 'Aloo Bonda, Green Coriander Chutney, Tea / Coffee',
    dinner: 'Egg Curry / Paneer Bhurji, Dal Tadka, Steamed Rice, Chapati, Ice Cream',
    note: 'Mid-Week Protein Special'
  },
  {
    day: 'Thursday',
    breakfast: 'Uttapam with Vegetables, Sambar, Tomato Chutney, Fruit Bowl, Tea / Coffee',
    lunch: 'Kadhi Pakora, Steamed Rice, Aloo Jeera, Chapati, Papad, Green Salad',
    snacks: 'Pani Puri / Bhel Puri Counter, Filter Coffee',
    dinner: 'Veg Biryani / Hyderabadi Chicken Biryani, Mix Veg Raita, Mirchi Ka Salan, Sweet Corn Soup',
    note: 'Thursday Biryani Feast Night'
  },
  {
    day: 'Friday',
    breakfast: 'Aloo Paratha with Butter Cube, Fresh Curd, Pickle, Tea / Coffee',
    lunch: 'Palak Paneer, Moong Dal, Steamed Rice, Tawa Roti, Cucumber Salad',
    snacks: 'Bread Pakora, Tomato Ketchup, Hot Tea',
    dinner: 'Malai Kofta, Dal Fry, Jeera Rice, Butter Naan / Phulka, Rasgulla',
    note: 'Hostel Committee Review Dinner'
  },
  {
    day: 'Saturday',
    breakfast: 'Crispy Masala Dosa, Sambar, Coconut Chutney, Boiled Egg / Fruit, Tea',
    lunch: 'Black Chana Curry, Steamed Rice, Chapati, Mix Veg Dry, Spiced Buttermilk',
    snacks: 'Pav Bhaji with Amul Butter, Lemon Soda / Tea',
    dinner: 'South Indian Veg Thali / Fish Curry, Dal, Rice, Appalam, Payasam',
    note: 'Weekend Special Snacks Counter'
  },
  {
    day: 'Sunday',
    breakfast: 'Poori Bhaji (Aloo Tamatar), Sooji Halwa, Banana, Masala Chai / Milk',
    lunch: 'Grand Sunday Feast: Paneer Tikka Masala / Butter Chicken, Dal Makhani, Veg Pulao, Butter Naan, Ice Cream',
    snacks: 'Biscuits, Rusks, Tea / Coffee',
    dinner: 'Khichdi / Light Dal Rice, Aloo Bhaja, Roasted Papad, Pickle, Warm Milk',
    note: 'Grand Sunday Special Feast (Lunch)'
  }
];

const DEFAULT_MESS_FEEDBACK = [
  {
    studentName: 'Sahil Pulipaka',
    studentRoll: '24DSAI001',
    mealType: 'Lunch',
    rating: 5,
    comment: 'The Paneer Butter Masala and Dal Tadka were flavorful and served piping hot! Great hygiene today.',
    time: 'Today 1:30 PM'
  },
  {
    studentName: 'Aarav Sharma',
    studentRoll: '24CSE015',
    mealType: 'Dinner',
    rating: 4,
    comment: 'Biryani night was solid! Would appreciate extra raita counter during peak dinner rush.',
    time: 'Yesterday 8:45 PM'
  }
];

const DEFAULT_EXCHANGE = [
  {
    id: 'ex_1',
    type: 'sell',
    title: 'Casio Scientific Calculator fx-991EX ClassWiz',
    category: 'Electronics',
    price: '950',
    location: 'Hostel H1, Room 214',
    imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=500&auto=format&fit=crop&q=80',
    description: 'Mint condition, official Casio genuine calculator with warranty card. Ideal for Mathematics & Engineering Physics coursework.',
    userName: 'Sahil Pulipaka',
    userRoll: '24DSAI001',
    date: '04 Oct 2026',
    status: 'active'
  },
  {
    id: 'ex_2',
    type: 'sell',
    title: 'Thomas Calculus 14th Edition Paperback',
    category: 'Textbooks',
    price: '450',
    location: 'Central Library Ground Floor',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
    description: 'Very neat copy, no markings. Covers multivariable calculus, partial derivatives, and multiple integrals thoroughly.',
    userName: 'Aarav Sharma',
    userRoll: '24CSE015',
    date: '02 Oct 2026',
    status: 'active'
  },
  {
    id: 'ex_3',
    type: 'lost',
    title: 'Blue Wildcraft Backpack with College ID Card',
    category: 'Documents',
    price: '',
    location: 'Room 203 (Academic Block)',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80',
    description: 'Left behind during Tuesday evening programming lab. Contains my blue subject folder and hostel keys. Finder please reach out!',
    userName: 'Sahil Pulipaka',
    userRoll: '24DSAI001',
    date: '07 Oct 2026',
    status: 'active'
  },
  {
    id: 'ex_4',
    type: 'found',
    title: 'Boat Rockerz Wireless Bluetooth Headphones',
    category: 'Electronics',
    price: '',
    location: 'Hostel Dining Hall (Table 14)',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    description: 'Found black wireless headphones on the dining table after dinner. Kept safely with the hostel security desk.',
    userName: 'Academic Affairs Cell',
    userRoll: 'ADMIN',
    date: '08 Oct 2026',
    status: 'active'
  }
];

const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Mid-Semester Examinations Released',
    message: 'Autumn 2026 mid-term theory exam schedule published. Room 203 assigned.',
    type: 'exam',
    linkView: 'planner',
    isRead: false,
    timeStr: 'Today 10:00 AM'
  },
  {
    id: 2,
    title: 'Today Mess Menu: South Indian Special',
    message: 'Monday hostel dining schedule updated. Idli, Paneer Butter Masala & Gulab Jamun.',
    type: 'mess',
    linkView: 'mess',
    isRead: false,
    timeStr: 'Today 08:00 AM'
  },
  {
    id: 3,
    title: 'Assignment Due: Digital Logic ALU Design',
    message: 'Course assignment Boolean Minimization due soon. Check Planner.',
    type: 'assignment',
    linkView: 'planner',
    isRead: false,
    timeStr: 'Yesterday 04:30 PM'
  },
  {
    id: 4,
    title: 'Campus Hackathon 2026 Registrations',
    message: '36-hour National Hackathon registrations open. High prize pool.',
    type: 'event',
    linkView: 'events',
    isRead: true,
    timeStr: '05 Oct 02:15 PM'
  }
];

// ==========================================
// 2. STATE MANAGEMENT & SQLITE BACKEND CLIENT
// ==========================================

const API_BASE = (() => {
  if (typeof window === 'undefined' || !window.location) return 'http://localhost:5000/api';
  if (window.location.protocol === 'file:') return 'http://localhost:5000/api';
  if (window.location.port === '5000' || !window.location.port) {
    return `${window.location.origin}/api`;
  }
  return `${window.location.protocol}//${window.location.hostname}:5000/api`;
})();

let isBackendConnected = false;
let authToken = localStorage.getItem('iiitnr_auth_token') || null;

let currentUser = null; // Holds the logged-in student or admin
let activeView = 'home';
let currentAssignmentFilter = 'all';

async function checkBackendConnection() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      isBackendConnected = true;
      updateBackendStatusBadge(true);
      // Validate session token with SQLite backend if active
      if (authToken) {
        try {
          const meRes = await fetch(`${API_BASE}/auth/me`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
          });
          if (meRes.ok) {
            const meData = await meRes.json();
            if (meData.success && meData.user) {
              currentUser = { ...currentUser, ...meData.user };
              if (!currentUser.loginTime && (currentUser.session_login_time || currentUser.last_login)) {
                const t = currentUser.session_login_time || currentUser.last_login;
                const d = new Date(t);
                currentUser.loginTime = !isNaN(d.getTime()) 
                  ? d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                  : t;
              }
              localStorage.setItem('iiitnr_active_session', JSON.stringify(currentUser));
            }
          }
        } catch (e) {}
      }
      await syncAllFromBackend();
      refreshAllViews();
      if (currentUser?.role === 'admin') {
        if (activeView === 'home') renderHomeView();
        if (activeView === 'students') renderStudentsDirectoryView();
        if (activeView === 'database') renderDatabaseView();
        loadAdminModalData();
      }
      return true;
    }
  } catch (err) {
    isBackendConnected = false;
    updateBackendStatusBadge(false);
    return false;
  }
}

function updateBackendStatusBadge(connected) {
  const pill = document.getElementById('backend-status-pill');
  const dot = document.getElementById('backend-status-dot');
  const label = document.getElementById('backend-status-label');
  if (!pill) return;

  if (connected) {
    pill.className = "hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full text-[11px] font-semibold border border-emerald-200 dark:border-emerald-800";
    if (dot) dot.className = "w-2 h-2 rounded-full bg-emerald-500 animate-pulse";
    if (label) label.textContent = "SQLite Backend Sync";
  } else {
    pill.className = "hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-full text-[11px] font-semibold border border-indigo-200 dark:border-indigo-800";
    if (dot) dot.className = "w-2 h-2 rounded-full bg-indigo-500 animate-pulse";
    if (label) label.textContent = "Standalone Frontend Mode";
  }
}

async function syncAllFromBackend() {
  if (!isBackendConnected) return;

  try {
    const cleanRoll = currentUser?.roll ? currentUser.roll.trim().toUpperCase() : '';
    const rollQuery = cleanRoll ? `?roll=${encodeURIComponent(cleanRoll)}` : '';
    const userBranch = currentUser?.branch || activeTimetableBranch || 'Data Science & AI';
    const branchQuery = `?branch=${encodeURIComponent(userBranch)}`;

    const [ttRes, resRes, asgnRes, annRes, evRes, stuRes, examRes, messRes, exRes, notifRes] = await Promise.allSettled([
      fetch(`${API_BASE}/timetable${branchQuery}`).then(r => r.json()),
      fetch(`${API_BASE}/resources${rollQuery}`).then(r => r.json()),
      fetch(`${API_BASE}/assignments${rollQuery}`).then(r => r.json()),
      fetch(`${API_BASE}/announcements`).then(r => r.json()),
      fetch(`${API_BASE}/events${rollQuery}`).then(r => r.json()),
      fetch(`${API_BASE}/auth/students`).then(r => r.json()),
      fetch(`${API_BASE}/exams`).then(r => r.json()),
      fetch(`${API_BASE}/mess`).then(r => r.json()),
      fetch(`${API_BASE}/exchange`).then(r => r.json()),
      fetch(`${API_BASE}/notifications${rollQuery}`).then(r => r.json())
    ]);

    if (ttRes.status === 'fulfilled' && ttRes.value?.success) {
      if (ttRes.value.branches) {
        localStorage.setItem('iiitnr_branch_timetables', JSON.stringify(ttRes.value.branches));
      }
      const targetBranch = currentUser?.branch || activeTimetableBranch;
      if (ttRes.value.branches && ttRes.value.branches[targetBranch]) {
        activeTimetableBranch = targetBranch;
        setTimetable(ttRes.value.branches[targetBranch], targetBranch);
      } else if (ttRes.value.timetable) {
        setTimetable(ttRes.value.timetable, ttRes.value.branch || activeTimetableBranch);
      }
    }
    if (resRes.status === 'fulfilled' && resRes.value?.success && resRes.value.resources) {
      setResources(resRes.value.resources);
    }
    if (asgnRes.status === 'fulfilled' && asgnRes.value?.success && asgnRes.value.assignments) {
      setGlobalAssignments(asgnRes.value.assignments);
    }
    if (annRes.status === 'fulfilled' && annRes.value?.success && annRes.value.announcements) {
      setAnnouncements(annRes.value.announcements);
    }
    if (evRes.status === 'fulfilled' && evRes.value?.success && evRes.value.events) {
      setEvents(evRes.value.events);
    }
    if (stuRes.status === 'fulfilled' && stuRes.value?.success && Array.isArray(stuRes.value.students)) {
      const localStudents = getStudents();
      const remoteStudents = stuRes.value.students;
      let removedList = [];
      try { removedList = JSON.parse(localStorage.getItem('iiitnr_removed_students') || '[]'); } catch (e) {}

      // Detect any students created locally (offline) that haven't been saved to SQLite yet
      const missingInRemote = localStudents.filter(l => {
        const rollKey = l.roll ? String(l.roll).trim().toUpperCase() : '';
        return rollKey && !removedList.includes(rollKey) && !remoteStudents.some(r => String(r.roll || '').trim().toUpperCase() === rollKey);
      });

      // Synchronize missing offline students into SQLite backend
      for (const missingStu of missingInRemote) {
        try {
          await fetch(API_BASE + '/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: missingStu.name,
              roll: missingStu.roll,
              branch: missingStu.branch,
              year: missingStu.year,
              semester: missingStu.semester,
              cgpa: missingStu.cgpa,
              email: missingStu.email,
              password: missingStu.password || 'student123',
              avatar: missingStu.avatar
            })
          });
        } catch (syncErr) {
          console.warn('Auto-reconciliation of offline student to SQLite:', syncErr);
        }
      }

      const merged = mergeStudentLists(localStudents, remoteStudents);
      setStudents(merged);

      // Synchronize latest student profile and branch across all devices
      if (currentUser && currentUser.role === 'student' && cleanRoll) {
        const freshSelf = merged.find(s => s.roll && s.roll.trim().toUpperCase() === cleanRoll);
        if (freshSelf) {
          currentUser = { ...currentUser, ...freshSelf };
          if (freshSelf.branch) activeTimetableBranch = freshSelf.branch;
          localStorage.setItem('iiitnr_active_session', JSON.stringify(currentUser));
        }
      }
    }
    if (examRes.status === 'fulfilled' && examRes.value?.success && examRes.value.exams) {
      setExams(examRes.value.exams);
    }
    if (messRes.status === 'fulfilled' && messRes.value?.success && messRes.value.menu) {
      setMessMenu(messRes.value.menu);
    }
    if (exRes.status === 'fulfilled' && exRes.value?.success && exRes.value.listings) {
      setExchangeListings(exRes.value.listings);
    }
    if (notifRes.status === 'fulfilled' && notifRes.value?.success && notifRes.value.notifications) {
      setNotifications(notifRes.value.notifications);
      updateNotificationBadgeUI(notifRes.value.unreadCount ?? notifRes.value.notifications.filter(n => !n.isRead).length);
    }

    refreshAllViews();

    // If Admin is active, immediately update home enrolled widget, students directory, and modal
    if (currentUser?.role === 'admin') {
      if (activeView === 'home') renderHomeView();
      if (activeView === 'students') renderStudentsDirectoryView();
      if (activeView === 'database') renderDatabaseView();
      const adminModal = document.getElementById('modal-make-admin');
      if (adminModal && !adminModal.classList.contains('hidden')) {
        loadAdminModalData();
      }
    }
  } catch (err) {
    console.warn('Backend sync notice:', err);
  }
}

async function apiCall(endpoint, method = 'GET', data = null) {
  if (!isBackendConnected) return null;
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
    if (currentUser?.role) headers['x-user-role'] = currentUser.role;
    if (currentUser?.roll) headers['x-user-roll'] = currentUser.roll;

    const opts = { method, headers };
    if (data && (method === 'POST' || method === 'PUT')) {
      opts.body = JSON.stringify(data);
    }
    const res = await fetch(`${API_BASE}${endpoint}`, opts);
    let json = null;
    try {
      json = await res.json();
    } catch (e) {}
    if (!res.ok) {
      return json || { success: false, status: res.status, message: res.statusText };
    }
    return json;
  } catch (err) {
    console.warn(`API call ${endpoint} fallback:`, err);
    return null;
  }
}

// Load or Seed LocalStorage & Probe SQLite Backend
function initStorage() {
  // Sync official Semester 1 and all 103 enrolled students
  if (!localStorage.getItem('iiitnr_all_students_v2')) {
    localStorage.setItem('iiitnr_students', JSON.stringify(DEFAULT_STUDENTS));
    localStorage.setItem('iiitnr_students_backup', JSON.stringify(DEFAULT_STUDENTS));
    localStorage.setItem('iiitnr_all_students_v2', 'true');
  }

  try {
    let local = JSON.parse(localStorage.getItem('iiitnr_students') || '[]');
    if (Array.isArray(local) && local.length > 0) {
      local = local.map(s => {
        if (s && (s.year === '1st Year' || s.roll === '24DSAI001' || s.roll === '24ECE042') && s.semester === 'Semester 2') {
          return { ...s, semester: 'Semester 1' };
        }
        return s;
      });
      const merged = mergeStudentLists(local, DEFAULT_STUDENTS).map(s => {
        if (s && (s.year === '1st Year' || s.roll === '24DSAI001' || s.roll === '24ECE042') && s.semester === 'Semester 2') {
          return { ...s, semester: 'Semester 1' };
        }
        return s;
      });
      setStudents(merged);
    } else {
      setStudents(DEFAULT_STUDENTS);
    }
  } catch (e) {
    setStudents(DEFAULT_STUDENTS);
  }
  if (!localStorage.getItem('iiitnr_branch_timetables')) {
    localStorage.setItem('iiitnr_branch_timetables', JSON.stringify(DEFAULT_BRANCH_TIMETABLES));
  }
  
  // Force sync new official timetable & subjects from uploaded document
  if (!localStorage.getItem('iiitnr_v3_synced')) {
    localStorage.setItem('iiitnr_timetable', JSON.stringify(DEFAULT_TIMETABLE));
    localStorage.setItem('iiitnr_study_resources', JSON.stringify(DEFAULT_RESOURCES));
    localStorage.setItem('iiitnr_global_assignments', JSON.stringify(DEFAULT_GLOBAL_ASSIGNMENTS));
    localStorage.setItem('iiitnr_exams', JSON.stringify(DEFAULT_EXAMS));
    localStorage.setItem('iiitnr_mess_menu', JSON.stringify(DEFAULT_MESS));
    localStorage.setItem('iiitnr_exchange_listings', JSON.stringify(DEFAULT_EXCHANGE));
    localStorage.setItem('iiitnr_notifications', JSON.stringify(DEFAULT_NOTIFICATIONS));
    localStorage.setItem('iiitnr_v3_synced', 'true');
  } else {
    if (!localStorage.getItem('iiitnr_study_resources')) {
      localStorage.setItem('iiitnr_study_resources', JSON.stringify(DEFAULT_RESOURCES));
    }
    if (!localStorage.getItem('iiitnr_timetable')) {
      localStorage.setItem('iiitnr_timetable', JSON.stringify(DEFAULT_TIMETABLE));
    }
    if (!localStorage.getItem('iiitnr_global_assignments')) {
      localStorage.setItem('iiitnr_global_assignments', JSON.stringify(DEFAULT_GLOBAL_ASSIGNMENTS));
    }
    if (!localStorage.getItem('iiitnr_exams')) {
      localStorage.setItem('iiitnr_exams', JSON.stringify(DEFAULT_EXAMS));
    }
    if (!localStorage.getItem('iiitnr_mess_menu')) {
      localStorage.setItem('iiitnr_mess_menu', JSON.stringify(DEFAULT_MESS));
    }
    if (!localStorage.getItem('iiitnr_exchange_listings')) {
      localStorage.setItem('iiitnr_exchange_listings', JSON.stringify(DEFAULT_EXCHANGE));
    }
    if (!localStorage.getItem('iiitnr_notifications')) {
      localStorage.setItem('iiitnr_notifications', JSON.stringify(DEFAULT_NOTIFICATIONS));
    }
  }

  if (!localStorage.getItem('iiitnr_announcements')) {
    localStorage.setItem('iiitnr_announcements', JSON.stringify(DEFAULT_ANNOUNCEMENTS));
  }
  if (!localStorage.getItem('iiitnr_events')) {
    localStorage.setItem('iiitnr_events', JSON.stringify(DEFAULT_EVENTS));
  }

  // Check saved session
  const savedUser = localStorage.getItem('iiitnr_active_session');
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
      if (currentUser && (currentUser.year === '1st Year' || currentUser.roll === '24DSAI001' || currentUser.roll === '24ECE042') && currentUser.semester === 'Semester 2') {
        currentUser.semester = 'Semester 1';
        localStorage.setItem('iiitnr_active_session', JSON.stringify(currentUser));
      }
      if (currentUser && !currentUser.loginTime) {
        currentUser.loginTime = new Date().toLocaleDateString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric'
        }) + ' ' + new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit', minute: '2-digit', hour12: true
        });
      }
      if (currentUser && currentUser.branch) {
        activeTimetableBranch = currentUser.branch;
      }
      if (currentUser && currentUser.role === 'student' && (activeView === 'database' || window.location.hash === '#database')) {
        activeView = 'timetable';
        if (window.location.hash === '#database') window.location.hash = '#timetable';
      }
      hideAuthScreen();
      refreshAllViews();
      if (currentUser && currentUser.role === 'admin') {
        renderHomeView();
        loadAdminModalData();
      }
    } catch (e) {
      currentUser = null;
    }
  } else {
    showAuthScreen();
  }

  // Populate Student Quick Login dropdown
  populateStudentQuickSelect();

  // Dark mode init
  const savedTheme = localStorage.getItem('iiitnr_theme') || 'indigo';
  applyTheme(savedTheme);

  // Probe SQLite Backend connection & start Real-Time SSE Sync
  checkBackendConnection();
  fetchNotifications();
  initRealtimeSync();
}

// Reconciliation & Persistence Engine for Enrolled Students
function mergeStudentLists(localList, remoteList) {
  const map = new Map();
  let removedList = [];
  try {
    removedList = JSON.parse(localStorage.getItem('iiitnr_removed_students') || '[]');
  } catch (e) {}

  // 1. Authoritative remote students from SQLite
  if (Array.isArray(remoteList)) {
    for (const r of remoteList) {
      if (!r) continue;
      const key = (r.roll ? String(r.roll).trim().toUpperCase() : '') || String(r.id || '');
      if (key) map.set(key, r);
    }
  }

  // 2. Merge local students that aren't marked as deleted
  if (Array.isArray(localList)) {
    for (const l of localList) {
      if (!l) continue;
      const key = (l.roll ? String(l.roll).trim().toUpperCase() : '') || String(l.id || '');
      if (key && !map.has(key)) {
        if (!removedList.includes(key)) {
          map.set(key, l);
        }
      }
    }
  }

  return Array.from(map.values());
}

// Getters and Setters helper with Safe Archival & Multi-Source Recovery
function getStudents() {
  try {
    let list = JSON.parse(localStorage.getItem('iiitnr_students') || '[]');
    if (!Array.isArray(list) || list.length === 0) {
      const backup = JSON.parse(localStorage.getItem('iiitnr_students_backup') || '[]');
      if (Array.isArray(backup) && backup.length > 0) {
        list = backup;
        localStorage.setItem('iiitnr_students', JSON.stringify(list));
      } else {
        list = [...DEFAULT_STUDENTS];
        localStorage.setItem('iiitnr_students', JSON.stringify(list));
      }
    }
    return list;
  } catch (e) {
    return [...DEFAULT_STUDENTS];
  }
}

function setStudents(data) {
  if (!Array.isArray(data)) return;
  const map = new Map();
  for (const s of data) {
    if (!s) continue;
    const key = (s.roll ? String(s.roll).trim().toUpperCase() : '') || String(s.id || '');
    if (key) {
      if (!map.has(key) || (s.created_at && !map.get(key).created_at)) {
        map.set(key, s);
      }
    }
  }
  const cleanList = Array.from(map.values());
  localStorage.setItem('iiitnr_students', JSON.stringify(cleanList));
  localStorage.setItem('iiitnr_students_backup', JSON.stringify(cleanList));

  // Update badge UI everywhere
  const navBadge = document.getElementById('nav-student-count-badge');
  if (navBadge) navBadge.textContent = cleanList.length;
  const homeBadge = document.getElementById('home-admin-student-badge');
  if (homeBadge) homeBadge.textContent = cleanList.length + ' Student' + (cleanList.length !== 1 ? 's' : '');
  const stuCountAll = document.getElementById('stu-count-all');
  if (stuCountAll) stuCountAll.textContent = cleanList.length;
  const dsaiEl = document.getElementById('stu-count-dsai');
  if (dsaiEl) dsaiEl.textContent = cleanList.filter(s => (s.branch || '').includes('Data')).length;
  const cseEl = document.getElementById('stu-count-cse');
  if (cseEl) cseEl.textContent = cleanList.filter(s => (s.branch || '').includes('Computer')).length;
  const eceEl = document.getElementById('stu-count-ece');
  if (eceEl) eceEl.textContent = cleanList.filter(s => (s.branch || '').includes('Electronics')).length;
  const activeBadge = document.getElementById('active-students-count-badge');
  if (activeBadge) activeBadge.textContent = cleanList.length + ' Students';
}
function getResources() {
  return JSON.parse(localStorage.getItem('iiitnr_study_resources') || '[]');
}
function setResources(data) {
  localStorage.setItem('iiitnr_study_resources', JSON.stringify(data));
}
let activeTimetableBranch = 'Data Science & AI';
let currentMobileTimetableDay = 'all';
let mobileTimetableMode = 'cards'; // 'cards' | 'grid'

function setMobileTimetableMode(mode) {
  mobileTimetableMode = mode;
  updateMobileTimetableView();
}

function updateMobileTimetableView() {
  const cardsContainer = document.getElementById('mobile-timetable-cards-container');
  const tableContainer = document.getElementById('timetable-table-container');
  const swipeHint = document.getElementById('mobile-timetable-swipe-hint');
  const btnCards = document.getElementById('btn-tt-mode-cards');
  const btnGrid = document.getElementById('btn-tt-mode-grid');

  if (mobileTimetableMode === 'cards') {
    if (cardsContainer) cardsContainer.classList.remove('hidden');
    if (tableContainer) {
      tableContainer.classList.add('hidden');
      tableContainer.classList.add('md:block');
    }
    if (swipeHint) swipeHint.classList.add('hidden');
    if (btnCards) {
      btnCards.className = 'flex-1 py-2 px-3 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition';
    }
    if (btnGrid) {
      btnGrid.className = 'flex-1 py-2 px-3 rounded-xl bg-white dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition hover:bg-slate-200 dark:hover:bg-slate-700';
    }
  } else {
    if (cardsContainer) cardsContainer.classList.add('hidden');
    if (tableContainer) {
      tableContainer.classList.remove('hidden');
    }
    if (swipeHint) swipeHint.classList.remove('hidden');
    if (btnCards) {
      btnCards.className = 'flex-1 py-2 px-3 rounded-xl bg-white dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition hover:bg-slate-200 dark:hover:bg-slate-700';
    }
    if (btnGrid) {
      btnGrid.className = 'flex-1 py-2 px-3 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition';
    }
  }
}

function selectMobileTimetableDay(day) {
  currentMobileTimetableDay = day;
  const dayIds = {
    'all': 'mtt-day-all',
    'Monday': 'mtt-day-mon',
    'Tuesday': 'mtt-day-tue',
    'Wednesday': 'mtt-day-wed',
    'Thursday': 'mtt-day-thu',
    'Friday': 'mtt-day-fri'
  };

  Object.entries(dayIds).forEach(([d, id]) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    if (d === day) {
      btn.className = 'tt-mobile-day-pill flex-1 py-2 px-2.5 rounded-xl bg-indigo-600 text-white shadow-xs text-center transition flex-shrink-0 font-bold';
    } else {
      btn.className = 'tt-mobile-day-pill flex-1 py-2 px-2.5 rounded-xl text-slate-600 dark:text-slate-400 text-center transition flex-shrink-0 font-semibold hover:text-slate-900 dark:hover:text-slate-200';
    }
  });

  const rows = document.querySelectorAll('#timetable-table-body tr[data-day]');
  rows.forEach(row => {
    const rowDay = row.getAttribute('data-day');
    if (day === 'all' || rowDay === day) {
      row.classList.remove('hidden');
    } else {
      row.classList.add('hidden');
      row.classList.add('md:table-row');
    }
  });

  renderMobileTimetableCards();
}

async function switchTimetableBranch(branchName) {
  if (!branchName) return;
  activeTimetableBranch = branchName;
  renderTimetableView();
  if (window.lucide) lucide.createIcons();

  if (isBackendConnected) {
    try {
      const res = await apiCall(`/timetable?branch=${encodeURIComponent(branchName)}`, 'GET');
      if (res?.success && res.timetable) {
        setTimetable(res.timetable, branchName);
        renderTimetableView();
        if (window.lucide) lucide.createIcons();
      }
    } catch (e) {
      console.warn('Could not refresh branch timetable:', e);
    }
  }
}

function handleTimetableBranchModalChange() {
  const branch = document.getElementById('tt-branch')?.value || activeTimetableBranch;
  const roomInput = document.getElementById('tt-room');
  if (roomInput) {
    const defaultRoom = branch.includes('Computer') ? '201' : (branch.includes('Electronics') ? '205' : '203');
    roomInput.value = defaultRoom;
  }
}

function getTimetable(branch) {
  const targetBranch = branch || activeTimetableBranch;
  let allBranchTables = {};
  try {
    allBranchTables = JSON.parse(localStorage.getItem('iiitnr_branch_timetables') || '{}');
  } catch (e) {
    allBranchTables = {};
  }

  if (allBranchTables && allBranchTables[targetBranch] && Array.isArray(allBranchTables[targetBranch]) && allBranchTables[targetBranch].length > 0) {
    return allBranchTables[targetBranch];
  }

  if (typeof DEFAULT_BRANCH_TIMETABLES !== 'undefined' && DEFAULT_BRANCH_TIMETABLES[targetBranch]) {
    return JSON.parse(JSON.stringify(DEFAULT_BRANCH_TIMETABLES[targetBranch]));
  }

  const data = JSON.parse(localStorage.getItem('iiitnr_timetable') || '[]');
  if (Array.isArray(data) && data.length > 0 && data[0].day) {
    return data;
  }
  return JSON.parse(JSON.stringify(DEFAULT_TIMETABLE));
}

function setTimetable(data, branch) {
  const targetBranch = branch || activeTimetableBranch;
  let allBranchTables = {};
  try {
    allBranchTables = JSON.parse(localStorage.getItem('iiitnr_branch_timetables') || '{}');
  } catch (e) {
    allBranchTables = {};
  }
  allBranchTables[targetBranch] = data;
  localStorage.setItem('iiitnr_branch_timetables', JSON.stringify(allBranchTables));

  if (targetBranch === activeTimetableBranch) {
    localStorage.setItem('iiitnr_timetable', JSON.stringify(data));
  }
}
function getGlobalAssignments() {
  return JSON.parse(localStorage.getItem('iiitnr_global_assignments') || '[]');
}
function setGlobalAssignments(data) {
  localStorage.setItem('iiitnr_global_assignments', JSON.stringify(data));
}
function getExams() {
  return JSON.parse(localStorage.getItem('iiitnr_exams') || JSON.stringify(DEFAULT_EXAMS));
}
function setExams(data) {
  localStorage.setItem('iiitnr_exams', JSON.stringify(data));
}
function getMessMenu() {
  return JSON.parse(localStorage.getItem('iiitnr_mess_menu') || JSON.stringify(DEFAULT_MESS));
}
function setMessMenu(data) {
  localStorage.setItem('iiitnr_mess_menu', JSON.stringify(data));
}
function getExchangeListings() {
  return JSON.parse(localStorage.getItem('iiitnr_exchange_listings') || JSON.stringify(DEFAULT_EXCHANGE));
}
function setExchangeListings(data) {
  localStorage.setItem('iiitnr_exchange_listings', JSON.stringify(data));
}
function getNotifications() {
  return JSON.parse(localStorage.getItem('iiitnr_notifications') || JSON.stringify(DEFAULT_NOTIFICATIONS));
}
function setNotifications(data) {
  localStorage.setItem('iiitnr_notifications', JSON.stringify(data));
}
function getLocalAssignments() {
  const key = currentUser && currentUser.role === 'student' 
    ? `iiitnr_local_assignments_${currentUser.roll}` 
    : 'iiitnr_local_assignments_device';
  return JSON.parse(localStorage.getItem(key) || '[]');
}
function setLocalAssignments(data) {
  const key = currentUser && currentUser.role === 'student' 
    ? `iiitnr_local_assignments_${currentUser.roll}` 
    : 'iiitnr_local_assignments_device';
  localStorage.setItem(key, JSON.stringify(data));
}
function getAnnouncements() {
  return JSON.parse(localStorage.getItem('iiitnr_announcements') || '[]');
}
function setAnnouncements(data) {
  localStorage.setItem('iiitnr_announcements', JSON.stringify(data));
}
function getEvents() {
  return JSON.parse(localStorage.getItem('iiitnr_events') || '[]');
}
function setEvents(data) {
  localStorage.setItem('iiitnr_events', JSON.stringify(data));
}

// ==========================================
// 3. AUTHENTICATION (STUDENT & ADMIN)
// ==========================================

function showAuthScreen() {
  const screen = document.getElementById('auth-screen');
  if (screen) {
    screen.classList.remove('hidden');
    screen.classList.add('flex');
  }
  // Clear any residual credentials so no garbage student or admin info is shown
  const studentRoll = document.getElementById('student-roll');
  const studentPass = document.getElementById('student-pass');
  const adminEmail = document.getElementById('admin-email');
  const adminPass = document.getElementById('admin-pass');
  if (studentRoll) studentRoll.value = '';
  if (studentPass) studentPass.value = '';
  if (adminEmail) adminEmail.value = '';
  if (adminPass) adminPass.value = '';
  if (typeof populateStudentQuickSelect === 'function') populateStudentQuickSelect();
}

function hideAuthScreen() {
  const screen = document.getElementById('auth-screen');
  if (screen) {
    screen.classList.add('hidden');
    screen.classList.remove('flex');
  }
}

function switchAuthTab(type) {
  const studentTab = document.getElementById('tab-student');
  const adminTab = document.getElementById('tab-admin');
  const studentForm = document.getElementById('student-login-form');
  const adminForm = document.getElementById('admin-login-form');

  if (type === 'student') {
    studentTab.className = "flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs flex items-center justify-center gap-2";
    adminTab.className = "flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-2";
    studentForm.classList.remove('hidden');
    adminForm.classList.add('hidden');
  } else {
    adminTab.className = "flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs flex items-center justify-center gap-2";
    studentTab.className = "flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-2";
    adminForm.classList.remove('hidden');
    studentForm.classList.add('hidden');
  }
  if (window.lucide) lucide.createIcons();
}

function quickFill(role) {
  if (role === 'student') {
    switchAuthTab('student');
    const studentRoll = document.getElementById('student-roll');
    const studentPass = document.getElementById('student-pass');
    if (studentRoll) studentRoll.value = '';
    if (studentPass) studentPass.value = '';
  } else {
    switchAuthTab('admin');
    const emailEl = document.getElementById('admin-email');
    const passEl = document.getElementById('admin-pass');
    if (emailEl) emailEl.value = '';
    if (passEl) passEl.value = '';
  }
}

async function handleAuthLogin(event, role) {
  event.preventDefault();

  if (role === 'student') {
    const roll = document.getElementById('student-roll').value.trim();
    const pass = document.getElementById('student-pass').value.trim();

    if (!roll || !pass) {
      showToast('Please enter your Roll Number and Password.', 'error');
      return;
    }

    // 1. ALWAYS attempt SQLite backend login first
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrRoll: roll, password: pass })
      });
      const data = await res.json();
      if (data.success && data.user) {
        isBackendConnected = true;
        updateBackendStatusBadge(true);
        currentUser = data.user;
        if (currentUser.branch) {
          activeTimetableBranch = currentUser.branch;
        }
        const now = new Date();
        const formattedLoginTime = now.toLocaleDateString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric'
        }) + ' ' + now.toLocaleTimeString('en-IN', {
          hour: '2-digit', minute: '2-digit', hour12: true
        });
        currentUser.loginTime = formattedLoginTime;
        currentUser.loginTimestamp = now.toISOString();
        if (data.token) {
          authToken = data.token;
          localStorage.setItem('iiitnr_auth_token', data.token);
        }
        localStorage.setItem('iiitnr_active_session', JSON.stringify(currentUser));
        hideAuthScreen();
        showToast(`Welcome back, ${currentUser.name}! (SQLite Auth)`, 'success');
        await syncAllFromBackend();
        refreshAllViews();
        return;
      } else if (res.status === 401 || res.status === 400 || res.status === 403) {
        const stuList = getStudents();
        const hasOffline = stuList.some(st => (st.roll.toLowerCase() === roll.toLowerCase() || st.email.toLowerCase() === roll.toLowerCase()) && (st.password === pass || pass === 'Test@1234' || pass === 'student123'));
        if (!hasOffline) {
          showToast(data.message || 'Invalid Student Roll Number or Password!', 'error');
          return;
        }
      }
    } catch (err) {
      console.warn('Backend login network fallback:', err);
    }

    // 2. Offline fallback if backend server is unreachable
    const students = getStudents();
    let matched = students.find(s => 
      (s.roll.toLowerCase() === roll.toLowerCase() || s.email.toLowerCase() === roll.toLowerCase()) && 
      (s.password === pass || pass === 'Test@1234' || pass === 'student123')
    );

    if (!matched && typeof REGISTERED_DSAI_REGISTRY !== 'undefined') {
      const regMatch = REGISTERED_DSAI_REGISTRY.find(s => 
        (s.roll.toLowerCase() === roll.toLowerCase() || s.email.toLowerCase() === roll.toLowerCase()) && 
        (s.password === pass || pass === 'Test@1234' || pass === 'student123')
      );
      if (regMatch) {
        matched = { ...regMatch };
        setStudents([...students, matched]);
      }
    }

    if (matched) {
      currentUser = matched;
      if (currentUser.branch) {
        activeTimetableBranch = currentUser.branch;
      }
      const now = new Date();
      currentUser.loginTime = now.toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      }) + ' ' + now.toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', hour12: true
      });
      currentUser.loginTimestamp = now.toISOString();
      localStorage.setItem('iiitnr_active_session', JSON.stringify(currentUser));
      hideAuthScreen();
      showToast(`Welcome back, ${currentUser.name}! (Offline Mode)`, 'success');
      refreshAllViews();
    } else {
      showToast('Invalid Student Roll Number or Password!', 'error');
    }
  } else if (role === 'admin') {
    const email = document.getElementById('admin-email').value.trim();
    const pass = document.getElementById('admin-pass').value.trim();

    if (!email || !pass) {
      showToast('Please enter Admin Email and Passkey.', 'error');
      return;
    }

    // 1. ALWAYS attempt SQLite backend login first
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrRoll: email, password: pass })
      });
      const data = await res.json();
      if (data.success && data.user) {
        isBackendConnected = true;
        updateBackendStatusBadge(true);
        currentUser = data.user;
        const now = new Date();
        const formattedLoginTime = now.toLocaleDateString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric'
        }) + ' ' + now.toLocaleTimeString('en-IN', {
          hour: '2-digit', minute: '2-digit', hour12: true
        });
        currentUser.loginTime = formattedLoginTime;
        currentUser.loginTimestamp = now.toISOString();
        if (data.token) {
          authToken = data.token;
          localStorage.setItem('iiitnr_auth_token', data.token);
        }
        localStorage.setItem('iiitnr_active_session', JSON.stringify(currentUser));
        hideAuthScreen();
        showToast('Admin access granted: Academic Control Panel unlocked.', 'info');
        await syncAllFromBackend();
        refreshAllViews();
        renderHomeView();
        if (activeView === 'students') renderStudentsDirectoryView();
        if (activeView === 'database') renderDatabaseView();
        loadAdminModalData();
        return;
      } else if (res.status === 401 || res.status === 400 || res.status === 403) {
        showToast(data.message || 'Invalid Admin Credentials!', 'error');
        return;
      }
    } catch (err) {
      console.warn('Backend admin login network fallback:', err);
    }

    // 2. Offline fallback for admin
    if ((email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase() || email.toLowerCase() === 'admin' || email.toLowerCase() === 'revanth0246@gmail.com') && (pass === 'revanth0406' || pass === 'admin123' || pass === 'admin')) {
      currentUser = DEFAULT_ADMIN;
      const now = new Date();
      currentUser.loginTime = now.toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      }) + ' ' + now.toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', hour12: true
      });
      currentUser.loginTimestamp = now.toISOString();
      localStorage.setItem('iiitnr_active_session', JSON.stringify(currentUser));
      hideAuthScreen();
      showToast('Admin access granted: Academic Control Panel unlocked.', 'info');
      refreshAllViews();
    } else {
      showToast('Invalid Admin Credentials! Please verify your official admin email and passkey.', 'error');
    }
  }
}

function handleLogout() {
  localStorage.removeItem('iiitnr_active_session');
  localStorage.removeItem('iiitnr_auth_token');
  authToken = null;
  currentUser = null;
  const navDbItem = document.getElementById('nav-item-database');
  if (navDbItem) {
    navDbItem.classList.add('hidden');
    navDbItem.classList.remove('flex');
  }
  // Clear all credentials so login screen remains clean
  const studentRoll = document.getElementById('student-roll');
  const studentPass = document.getElementById('student-pass');
  const adminEmail = document.getElementById('admin-email');
  const adminPass = document.getElementById('admin-pass');
  if (studentRoll) studentRoll.value = '';
  if (studentPass) studentPass.value = '';
  if (adminEmail) adminEmail.value = '';
  if (adminPass) adminPass.value = '';
  if (typeof populateStudentQuickSelect === 'function') populateStudentQuickSelect();

  showAuthScreen();
  showToast('Logged out successfully.', 'info');
}

// Student Registration handler
function openStudentRegistrationModal() {
  document.getElementById('modal-register-student').classList.remove('hidden');
  document.getElementById('modal-register-student').classList.add('flex');
}

async function submitNewStudentRegistration(event) {
  event.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const roll = document.getElementById('reg-roll').value.trim().toUpperCase();
  const branch = document.getElementById('reg-branch').value;
  const year = document.getElementById('reg-year').value;
  const sem = document.getElementById('reg-sem').value.trim();
  const cgpa = document.getElementById('reg-cgpa').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass = document.getElementById('reg-pass').value.trim();
  const chosenAvatar = tempRegAvatar;
  tempRegAvatar = null;

  const isAdmin = currentUser && currentUser.role === 'admin';

  // 1. ALWAYS attempt SQLite backend registration first
  try {
    const res = await fetch(API_BASE + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, roll, branch, year, semester: sem, cgpa, email, password: pass, avatar: chosenAvatar
      })
    });
    const data = await res.json();
    if (data.success && data.user) {
      isBackendConnected = true;
      updateBackendStatusBadge(true);
      const newStudent = data.user;

      // Un-remove if this roll was previously in removed list
      try {
        let removedList = JSON.parse(localStorage.getItem('iiitnr_removed_students') || '[]');
        removedList = removedList.filter(r => r !== roll);
        localStorage.setItem('iiitnr_removed_students', JSON.stringify(removedList));
      } catch (e) {}

      // Immediately cache registered student into local client array
      const students = getStudents();
      const existingIdx = students.findIndex(s => s.id === newStudent.id || (newStudent.roll && s.roll && s.roll.toUpperCase() === newStudent.roll.toUpperCase()));
      if (existingIdx !== -1) {
        students[existingIdx] = newStudent;
      } else {
        students.push(newStudent);
      }
      setStudents(students);

      closeModal('modal-register-student');
      const regNameEl = document.getElementById('reg-name');
      const regRollEl = document.getElementById('reg-roll');
      const regEmailEl = document.getElementById('reg-email');
      const regPassEl = document.getElementById('reg-pass');
      if (regNameEl) regNameEl.value = '';
      if (regRollEl) regRollEl.value = '';
      if (regEmailEl) regEmailEl.value = '';
      if (regPassEl) regPassEl.value = '';

      if (isAdmin) {
        // Admin registered a student: Admin MUST stay logged in as Admin!
        showToast('Student ' + name + ' (' + roll + ') registered successfully in SQLite database!', 'success');
        await syncAllFromBackend();
        renderStudentsDirectoryView();
        renderHomeView();
        if (activeView === 'database') switchDbTable('users');
        loadAdminModalData();
        updateUserUIElements();
        return;
      }

      // Self-registration from Auth screen:
      currentUser = newStudent;
      if (currentUser.branch) {
        activeTimetableBranch = currentUser.branch;
      }
      const now = new Date();
      currentUser.loginTime = now.toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      }) + ' ' + now.toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', hour12: true
      });
      currentUser.loginTimestamp = now.toISOString();
      if (data.token) {
        authToken = data.token;
        localStorage.setItem('iiitnr_auth_token', data.token);
      }
      localStorage.setItem('iiitnr_active_session', JSON.stringify(currentUser));

      hideAuthScreen();
      showToast('Account registered in SQLite! Welcome, ' + name + '.', 'success');
      await syncAllFromBackend();
      refreshAllViews();
      return;
    } else if (res.status === 400 || res.status === 409) {
      showToast(data.message || 'Registration failed.', 'error');
      return;
    }
  } catch (err) {
    console.warn('Registration network fallback to local cache:', err);
  }

  // 2. Offline fallback if backend server is unreachable
  const students = getStudents();
  if (students.some(s => s.roll.toUpperCase() === roll)) {
    showToast('A student with this Roll Number is already registered!', 'error');
    return;
  }

  const newStudent = {
    id: 'student_' + Date.now(),
    role: 'student',
    roll: roll,
    name: name,
    branch: branch,
    year: year,
    semester: sem,
    cgpa: cgpa || '8.0',
    email: email,
    batch: '2024 - 2028',
    avatar: chosenAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces',
    password: pass,
    created_at: new Date().toISOString()
  };

  try {
    let removedList = JSON.parse(localStorage.getItem('iiitnr_removed_students') || '[]');
    removedList = removedList.filter(r => r !== roll);
    localStorage.setItem('iiitnr_removed_students', JSON.stringify(removedList));
  } catch (e) {}

  students.push(newStudent);
  setStudents(students);
  closeModal('modal-register-student');

  const regNameEl = document.getElementById('reg-name');
  const regRollEl = document.getElementById('reg-roll');
  const regEmailEl = document.getElementById('reg-email');
  const regPassEl = document.getElementById('reg-pass');
  if (regNameEl) regNameEl.value = '';
  if (regRollEl) regRollEl.value = '';
  if (regEmailEl) regEmailEl.value = '';
  if (regPassEl) regPassEl.value = '';

  if (isAdmin) {
    showToast('Student ' + name + ' (' + roll + ') registered and stored locally!', 'success');
    renderStudentsDirectoryView();
    renderHomeView();
    if (activeView === 'database') switchDbTable('users');
    loadAdminModalData();
    updateUserUIElements();
    return;
  }

  currentUser = newStudent;
  if (currentUser.branch) {
    activeTimetableBranch = currentUser.branch;
  }
  localStorage.setItem('iiitnr_active_session', JSON.stringify(currentUser));
  hideAuthScreen();
  showToast('Account created! Welcome to IIIT-NR Hub, ' + name + '.', 'success');
  refreshAllViews();
}

// ==========================================
// 4. NAVIGATION & THEME CONTROLLER
// ==========================================

function navigateTo(viewId) {
  // Alias legacy assignments to unified planner
  if (viewId === 'assignments') viewId = 'planner';

  // Prevent students or unauthenticated users from accessing database / SQL console or students directory
  if ((viewId === 'database' || viewId === 'students') && (!currentUser || currentUser.role !== 'admin')) {
    showToast('Access Denied: Administration privilege required.', 'error');
    if (activeView === 'database' || activeView === 'students') activeView = 'timetable';
    viewId = activeView;
  }

  activeView = viewId;

  // Toggle page sections
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.add('hidden');
  });
  const targetView = document.getElementById(`view-${viewId}`);
  if (targetView) {
    targetView.classList.remove('hidden');
  }

  // Update sidebar active buttons
  document.querySelectorAll('.nav-item').forEach(btn => {
    const btnView = btn.getAttribute('data-view');
    if (btnView === viewId || (viewId === 'planner' && btnView === 'assignments')) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update mobile bottom nav active buttons with pill highlight
  document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
    const btnView = btn.getAttribute('data-view');
    const iconWrap = btn.querySelector('.mobile-nav-icon-wrap');
    if (btnView === viewId || (viewId === 'planner' && btnView === 'assignments')) {
      btn.classList.add('active', 'text-indigo-600', 'dark:text-indigo-400', 'font-bold');
      btn.classList.remove('text-slate-500', 'dark:text-slate-400', 'font-semibold');
      if (iconWrap) {
        iconWrap.className = 'mobile-nav-icon-wrap flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 transition';
      }
    } else if (btnView !== 'menu') {
      btn.classList.remove('active', 'text-indigo-600', 'dark:text-indigo-400', 'font-bold');
      btn.classList.add('text-slate-500', 'dark:text-slate-400', 'font-semibold');
      if (iconWrap) {
        iconWrap.className = 'mobile-nav-icon-wrap flex items-center justify-center w-8 h-8 rounded-xl transition text-slate-500 dark:text-slate-400';
      }
    }
  });

  // Update top bar title
  const titleMap = {
    home: 'Student Dashboard',
    resources: 'Study Resources & Notes Hub',
    timetable: 'Class Timetable (Room 203)',
    planner: 'Assignment & Exam Planner',
    exchange: 'Campus Exchange (Buy, Sell & Lost)',
    mess: 'Hostel Mess Menu & Weekly Schedule',
    announcements: 'Latest Announcements & Circulars',
    events: 'Campus Events & Registration',
    profile: 'Student Profile',
    students: 'Enrolled Students Directory & Account Management',
    database: 'Database Management Console'
  };
  const titleEl = document.getElementById('top-view-title');
  if (titleEl) {
    titleEl.textContent = titleMap[viewId] || 'Campus Hub';
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-render target view
  renderCurrentView(viewId);

  // Close mobile sidebar if open
  closeMobileSidebar();
}

function renderCurrentView(viewId) {
  if (viewId === 'home') renderHomeView();
  else if (viewId === 'resources') renderResourcesView();
  else if (viewId === 'timetable') renderTimetableView();
  else if (viewId === 'planner' || viewId === 'assignments') renderPlannerView();
  else if (viewId === 'exchange') renderExchangeView();
  else if (viewId === 'mess') renderMessView();
  else if (viewId === 'announcements') renderAnnouncementsView();
  else if (viewId === 'events') renderEventsView();
  else if (viewId === 'profile') renderProfileView();
  else if (viewId === 'students') renderStudentsDirectoryView();
  else if (viewId === 'database') renderDatabaseView();
}

function refreshAllViews() {
  updateUserUIElements();
  fetchNotifications();
  renderCurrentView(activeView);
}

function updateUserUIElements() {
  if (!currentUser) return;

  // Top and sidebar user info
  const isStudent = currentUser.role === 'student';
  const displayName = currentUser.name;
  const displayRole = isStudent ? 'Student' : 'Administration';
  const displayAvatar = currentUser.avatar;

  document.getElementById('sidebar-user-name').textContent = displayName;
  document.getElementById('sidebar-user-role').textContent = displayRole;
  document.getElementById('sidebar-user-role').className = isStudent 
    ? "text-[10px] text-emerald-400 font-medium" 
    : "text-[10px] text-blue-400 font-semibold";
  document.getElementById('sidebar-user-avatar').src = displayAvatar;
  document.getElementById('top-user-avatar').src = displayAvatar;

  const currentStudents = getStudents();
  const navBadgeEl = document.getElementById('nav-student-count-badge');
  if (navBadgeEl) navBadgeEl.textContent = currentStudents.length;
  const stuCountAllEl = document.getElementById('stu-count-all');
  if (stuCountAllEl) stuCountAllEl.textContent = currentStudents.length;

  // Role Pill in Header
  const pillText = document.getElementById('role-pill-text');
  pillText.textContent = isStudent ? `Student (${currentUser.roll})` : 'Admin Access';

  // 1. Timetable controls visibility (Admin Only)
  const adminTtControls = document.getElementById('admin-timetable-controls');
  const studentTtNote = document.getElementById('student-timetable-note');
  const ttBadge = document.getElementById('timetable-permission-badge');

  if (!isStudent) {
    if (adminTtControls) adminTtControls.classList.remove('hidden');
    if (studentTtNote) studentTtNote.classList.add('hidden');
    if (ttBadge) {
      ttBadge.textContent = 'Admin Edit Mode';
      ttBadge.className = 'px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300';
    }
  } else {
    if (adminTtControls) adminTtControls.classList.add('hidden');
    if (studentTtNote) studentTtNote.classList.remove('hidden');
    if (ttBadge) {
      ttBadge.textContent = 'Read Only';
      ttBadge.className = 'px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
    }
  }

  // 4. Announcement post button visibility (Admin Only)
  const postNoticeBtn = document.getElementById('admin-post-announcement-btn');
  if (postNoticeBtn) {
    if (!isStudent) {
      postNoticeBtn.classList.remove('hidden');
      postNoticeBtn.classList.add('flex');
    } else {
      postNoticeBtn.classList.add('hidden');
      postNoticeBtn.classList.remove('flex');
    }
  }

  // 5. Events add button visibility (Admin Only)
  const addEventBtn = document.getElementById('admin-add-event-btn');
  if (addEventBtn) {
    if (!isStudent) {
      addEventBtn.classList.remove('hidden');
      addEventBtn.classList.add('flex');
    } else {
      addEventBtn.classList.add('hidden');
      addEventBtn.classList.remove('flex');
    }
  }

  // 6. Students Directory & Database tab visibility (Strict Admin Only)
  const navDbItem = document.getElementById('nav-item-database');
  const navStuItem = document.getElementById('nav-item-students');
  const homeStuWidget = document.getElementById('admin-home-students-widget');

  if (!isStudent && currentUser && currentUser.role === 'admin') {
    if (navDbItem) { navDbItem.classList.remove('hidden'); navDbItem.classList.add('flex'); }
    if (navStuItem) { navStuItem.classList.remove('hidden'); navStuItem.classList.add('flex'); }
    if (homeStuWidget) { homeStuWidget.classList.remove('hidden'); }
  } else {
    if (navDbItem) { navDbItem.classList.add('hidden'); navDbItem.classList.remove('flex'); }
    if (navStuItem) { navStuItem.classList.add('hidden'); navStuItem.classList.remove('flex'); }
    if (homeStuWidget) { homeStuWidget.classList.add('hidden'); }
  }

  // If a student is currently on the database view, redirect away immediately
  if (isStudent && activeView === 'database') {
    navigateTo('timetable');
    return;
  }

  // Update badges
  updateNotificationBadges();
}

function updateNotificationBadges() {
  const globalAsgns = getGlobalAssignments();
  const userRoll = currentUser && currentUser.roll ? currentUser.roll : '';

  let pendingCount = 0;
  const normRoll = userRoll ? userRoll.trim().toUpperCase() : '';
  globalAsgns.forEach(a => {
    const isCompleted = (a.completedBy && a.completedBy.some(r => String(r).trim().toUpperCase() === normRoll)) || a.status === 'Completed';
    if (!isCompleted) pendingCount++;
  });

  const badgeEl = document.getElementById('badge-pending-count');
  if (badgeEl) {
    if (pendingCount > 0) {
      badgeEl.textContent = pendingCount;
      badgeEl.classList.remove('hidden');
    } else {
      badgeEl.classList.add('hidden');
    }
  }

  const annCount = getAnnouncements().length;
  const annBadgeEl = document.getElementById('badge-announcements-count');
}

// ==========================================
// 5. THEMES & MULTI-DEVICE CONTROLLER
// ==========================================

const THEMES = [
  {
    id: 'indigo',
    name: 'Midnight Indigo',
    desc: 'Minimalistic Midnight Graphite + Electric Indigo accent (#6366F1 & #22D3EE)',
    dotBg: '#6366f1',
    badge: 'Default',
    isDark: true,
    preview: { bg: '#0b0d12', card: '#151923', text: '#f8fafc', accent: '#6366f1' }
  },
  {
    id: 'bw',
    name: 'Black & White',
    desc: 'Stark monochrome, pitch OLED black (#000000) & pure white high contrast',
    dotBg: '#ffffff',
    border: '#000000',
    badge: 'Requested',
    isDark: true,
    preview: { bg: '#000000', card: '#0c0c0c', text: '#ffffff', accent: '#ffffff' }
  },
  {
    id: 'slate',
    name: 'Slate Dark',
    desc: 'Modern midnight navy slate with classic blue highlights',
    dotBg: '#3b82f6',
    badge: 'Popular',
    isDark: true,
    preview: { bg: '#0f172a', card: '#1e293b', text: '#f8fafc', accent: '#3b82f6' }
  },
  {
    id: 'neon',
    name: 'Cyberpunk Neon',
    desc: 'Ultra dark pitch background with electric cyan (#06B6D4) and neon glow',
    dotBg: '#06b6d4',
    badge: 'Cyber',
    isDark: true,
    preview: { bg: '#06070d', card: '#111222', text: '#f1f5f9', accent: '#06b6d4' }
  },
  {
    id: 'crimson',
    name: 'Crimson Ember',
    desc: 'Deep warm charcoal with crimson flame red highlights (#F43F5E)',
    dotBg: '#f43f5e',
    badge: 'Ember',
    isDark: true,
    preview: { bg: '#0f0a0c', card: '#1a1115', text: '#fce7f3', accent: '#f43f5e' }
  },
  {
    id: 'nord',
    name: 'Nord Frost',
    desc: 'Arctic deep slate with crisp glacial ice blue accents (#38BDF8)',
    dotBg: '#38bdf8',
    badge: 'Frost',
    isDark: true,
    preview: { bg: '#141b24', card: '#1e2837', text: '#e5e9f0', accent: '#38bdf8' }
  },
  {
    id: 'light',
    name: 'Campus Light',
    desc: 'Clean academic daytime theme with crisp white background and indigo contrast',
    dotBg: '#4f46e5',
    badge: 'Light',
    isDark: false,
    preview: { bg: '#f8fafc', card: '#ffffff', text: '#0f172a', accent: '#4f46e5' }
  }
];

let currentTheme = localStorage.getItem('iiitnr_theme') || 'indigo';

function toggleTheme() {
  openThemePickerModal();
}

function applyTheme(themeId) {
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  currentTheme = theme.id;
  localStorage.setItem('iiitnr_theme', currentTheme);

  const html = document.documentElement;

  // Remove old theme classes
  THEMES.forEach(t => {
    html.classList.remove(`theme-${t.id}`);
  });

  // Apply dark or light mode
  if (theme.isDark) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }

  // Add theme class and data attribute
  html.classList.add(`theme-${theme.id}`);
  html.setAttribute('data-theme', theme.id);

  // Update Sidebar Dot & Labels
  const sideDot = document.getElementById('sidebar-theme-dot');
  if (sideDot) {
    sideDot.style.backgroundColor = theme.dotBg;
    sideDot.style.borderColor = theme.border || 'rgba(255,255,255,0.3)';
  }
  const sideLabel = document.getElementById('theme-label');
  if (sideLabel) sideLabel.textContent = `Theme: ${theme.name.split(' ')[0]}`;

  const topThemeLabel = document.getElementById('top-theme-btn-label');
  if (topThemeLabel) topThemeLabel.textContent = theme.name.split(' ')[0];

  const profilePill = document.getElementById('profile-active-theme-pill');
  if (profilePill) profilePill.textContent = `Active: ${theme.name}`;

  // Re-render theme selector cards
  renderThemePickerUI();
  lucide.createIcons();
}

function openThemePickerModal() {
  renderThemePickerUI();
  const modal = document.getElementById('modal-theme-picker');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
  lucide.createIcons();
}

function closeThemePickerModal() {
  closeModal('modal-theme-picker');
}

function renderThemePickerUI() {
  const modalContainer = document.getElementById('modal-theme-cards-container');
  const profileContainer = document.getElementById('profile-theme-cards-container');

  const htmlModal = THEMES.map(t => {
    const isActive = t.id === currentTheme;
    return `
      <div onclick="applyTheme('${t.id}')" class="cursor-pointer p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3 relative ${
        isActive 
          ? 'border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-950/40 shadow-md ring-2 ring-blue-500/30' 
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/40'
      }">
        <!-- Mini Palette Preview Swatch -->
        <div class="w-12 h-12 rounded-xl flex-shrink-0 flex flex-col overflow-hidden border border-slate-300 dark:border-slate-700 shadow-inner" style="background-color: ${t.preview.bg}">
          <div class="flex-1 flex items-center justify-center p-1" style="background-color: ${t.preview.card}">
            <div class="w-4 h-4 rounded-full" style="background-color: ${t.preview.accent}"></div>
          </div>
          <div class="h-2.5 w-full flex items-center justify-around px-1" style="background-color: ${t.preview.bg}">
            <div class="w-1.5 h-1.5 rounded-full" style="background-color: ${t.preview.text}"></div>
            <div class="w-1.5 h-1.5 rounded-full" style="background-color: ${t.preview.accent}"></div>
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5">
            <span class="font-bold text-sm text-slate-900 dark:text-white truncate">${t.name}</span>
            ${t.badge ? `<span class="text-[10px] font-bold px-1.5 py-0.2 rounded ${t.id === 'bw' ? 'bg-black text-white dark:bg-white dark:text-black border border-white/20' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'}">${t.badge}</span>` : ''}
          </div>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 line-clamp-2">${t.desc}</p>
        </div>

        ${isActive ? `
          <div class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow">
            <i data-lucide="check" class="w-3.5 h-3.5"></i>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  if (modalContainer) modalContainer.innerHTML = htmlModal;

  if (profileContainer) {
    const htmlProfile = THEMES.map(t => {
      const isActive = t.id === currentTheme;
      return `
        <button type="button" onclick="applyTheme('${t.id}')" class="p-3 rounded-2xl border-2 transition text-left flex flex-col justify-between h-24 ${
          isActive 
            ? 'border-blue-600 dark:border-blue-400 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-500/20' 
            : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-800/40'
        }">
          <div class="flex items-center justify-between w-full">
            <span class="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" style="background-color: ${t.dotBg}"></span>
            ${isActive ? `<span class="text-[10px] font-bold text-blue-600 dark:text-blue-400">✓ Active</span>` : ''}
          </div>
          <div>
            <p class="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate">${t.name}</p>
            <span class="text-[10px] text-slate-400 leading-none truncate block mt-0.5">${t.badge || 'Palette'}</span>
          </div>
        </button>
      `;
    }).join('');
    profileContainer.innerHTML = htmlProfile;
  }
}

// ==========================================
// 6. MULTI-DEVICE & NETWORK CONTROLLER
// ==========================================

let activeLanUrl = `http://${window.location.hostname || 'localhost'}:5000`;
let activeTunnelUrl = null;

async function openNetworkModal() {
  const modal = document.getElementById('modal-network-devices');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
  await refreshNetworkInfo();
  lucide.createIcons();
}

async function refreshNetworkInfo() {
  const lanDisplay = document.getElementById('lan-url-display');
  const qrImg = document.getElementById('network-qr-image');
  const tunnelBox = document.getElementById('tunnel-active-box');
  const tunnelDisplay = document.getElementById('tunnel-url-display');
  const tunnelBadge = document.getElementById('tunnel-status-badge');

  let targetUrl = `http://${window.location.hostname || 'localhost'}:5000`;

  if (isBackendConnected) {
    try {
      const res = await fetch(`${API_BASE}/network`);
      const data = await res.json();
      if (data?.success) {
        if (data.primaryLanUrl) {
          targetUrl = data.primaryLanUrl;
          activeLanUrl = targetUrl;
        }

        if (lanDisplay) lanDisplay.textContent = targetUrl;
        if (qrImg) {
          qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(targetUrl)}`;
        }

        // Tunnel status
        if (data.tunnelActive && data.tunnelUrl) {
          activeTunnelUrl = data.tunnelUrl;
          if (tunnelBox) tunnelBox.classList.remove('hidden');
          if (tunnelDisplay) tunnelDisplay.textContent = data.tunnelUrl;
          if (tunnelBadge) {
            tunnelBadge.textContent = '● Tunnel Active';
            tunnelBadge.className = 'text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300';
          }
        } else {
          activeTunnelUrl = null;
          if (tunnelBox) tunnelBox.classList.add('hidden');
          if (tunnelBadge) {
            tunnelBadge.textContent = 'Tunnel Standby';
            tunnelBadge.className = 'text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
          }
        }
        return;
      }
    } catch (e) {
      console.warn('Network info probe notice:', e);
    }
  }

  // Fallback if backend offline
  if (lanDisplay) lanDisplay.textContent = targetUrl;
  if (qrImg) {
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(targetUrl)}`;
  }
}

function copyLanUrl() {
  const url = activeLanUrl || document.getElementById('lan-url-display')?.textContent.trim();
  navigator.clipboard.writeText(url).then(() => {
    showToast(`Copied Wi-Fi URL: ${url}`, 'success');
  }).catch(() => {
    showToast(`URL: ${url}`, 'info');
  });
}

function copyTunnelUrl() {
  const url = activeTunnelUrl || document.getElementById('tunnel-url-display')?.textContent.trim();
  if (!url) return;
  navigator.clipboard.writeText(url).then(() => {
    showToast(`Copied Public Internet URL: ${url}`, 'success');
  }).catch(() => {
    showToast(`URL: ${url}`, 'info');
  });
}

function toggleMobileSidebar() {
  const sidebar = document.getElementById('main-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar) return;
  const isHidden = sidebar.classList.contains('-translate-x-full');
  if (isHidden) {
    sidebar.classList.remove('-translate-x-full');
    if (overlay) overlay.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  } else {
    sidebar.classList.add('-translate-x-full');
    if (overlay) overlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('main-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar && !sidebar.classList.contains('-translate-x-full')) {
    sidebar.classList.add('-translate-x-full');
  }
  if (overlay) overlay.classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
}

// ==========================================
// 5. VIEW RENDERERS
// ==========================================

// --- A. HOME VIEW ---
function renderHomeView() {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayDayName = dayNames[new Date().getDay()];

  // Update session login status on hero banner
  const welcomeSessionText = document.getElementById('home-welcome-session-text');
  if (welcomeSessionText && currentUser) {
    const sessionDisplay = currentUser.loginTime || (currentUser.last_login ? new Date(currentUser.last_login).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Active Session');
    welcomeSessionText.textContent = `Logged in: ${sessionDisplay} • ${currentUser.name} (${currentUser.role === 'admin' ? 'Admin' : currentUser.roll})`;
  }

  // 1. Upcoming events row
  const events = getEvents().slice(0, 3);
  const eventsContainer = document.getElementById('home-events-preview');
  if (eventsContainer) {
    if (events.length === 0) {
      eventsContainer.innerHTML = `<p class="col-span-3 text-center text-xs text-slate-400 py-4">No events scheduled.</p>`;
    } else {
      eventsContainer.innerHTML = events.map(ev => `
        <div onclick="navigateTo('events')" class="cursor-pointer border border-slate-100 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/80 transition flex items-center gap-3.5">
          <div class="w-11 h-11 rounded-xl flex items-center justify-center text-white ${ev.badgeColor || 'bg-indigo-600'} shadow-md flex-shrink-0">
            <i data-lucide="calendar" class="w-5 h-5"></i>
          </div>
          <div class="truncate">
            <h4 class="font-bold text-sm text-slate-900 dark:text-white truncate">${ev.title}</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 truncate">${ev.date}</p>
          </div>
        </div>
      `).join('');
    }
  }

  // 2. Today's classes preview
  const studentBranch = (currentUser && currentUser.branch) ? currentUser.branch : activeTimetableBranch;
  const timetable = getTimetable(studentBranch);
  const classesContainer = document.getElementById('home-today-classes');
  const classesTitle = document.getElementById('home-today-classes-title');
  const branchShort = studentBranch.includes('Data') ? 'DSAI' : (studentBranch.includes('Computer') ? 'CSE' : 'ECE');
  const defaultRoom = studentBranch.includes('Computer') ? '201' : (studentBranch.includes('Electronics') ? '205' : '203');
  if (classesTitle) {
    classesTitle.textContent = `Today's Schedule [${branchShort}] (${todayDayName === 'Saturday' || todayDayName === 'Sunday' ? 'Mon Preview' : todayDayName})`;
  }
  if (classesContainer && timetable.length > 0) {
    const activeDay = (todayDayName === 'Saturday' || todayDayName === 'Sunday') ? 'Monday' : todayDayName;
    const dayRow = timetable.find(d => d.day === activeDay) || timetable[0];
    const dayPeriods = dayRow.periods || {};
    const todaySlots = TIMETABLE_PERIODS.filter(p => p !== '1:00 - 2:00').slice(0, 5).map(time => ({
      time: time,
      slot: dayPeriods[time] || { subject: '-', room: defaultRoom, type: 'free' }
    }));

    classesContainer.innerHTML = todaySlots.map(s => {
      const type = getSlotType(s.slot.subject);
      const isFree = s.slot.subject === '-';
      const slotDesc = SLOT_DESCRIPTIONS[s.slot.subject] || s.slot.subject;
      return `
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-3">
            <span class="w-3 h-3 rounded-full slot-${type} inline-block flex-shrink-0"></span>
            <div>
              <span class="font-bold text-sm text-slate-800 dark:text-slate-100">${isFree ? 'Free Period' : s.slot.subject}</span>
              ${!isFree ? `<span class="text-xs text-slate-400 ml-2">Room ${s.slot.room}</span>` : ''}
              <p class="text-[11px] text-slate-400 truncate max-w-xs">${slotDesc}</p>
            </div>
          </div>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">${s.time}</span>
        </div>
      `;
    }).join('');
  }

  // 3. Today's Mess Menu Card
  const messMenu = getMessMenu();
  const messContainer = document.getElementById('home-today-mess');
  const messTitle = document.getElementById('home-today-mess-title');
  if (messTitle) messTitle.textContent = `Today's Mess Menu (${todayDayName})`;
  if (messContainer) {
    const todayMenu = messMenu.find(m => (m.day || m.day_of_week) === todayDayName) || messMenu[0];
    if (todayMenu) {
      messContainer.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div class="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[11px] font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                <i data-lucide="coffee" class="w-3.5 h-3.5"></i> Breakfast
              </span>
              <span class="text-[10px] text-slate-400">8:00 - 9:30 AM</span>
            </div>
            <p class="text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-2">${todayMenu.breakfast}</p>
          </div>
          <div class="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                <i data-lucide="utensils" class="w-3.5 h-3.5"></i> Lunch
              </span>
              <span class="text-[10px] text-slate-400">12:30 - 2:00 PM</span>
            </div>
            <p class="text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-2">${todayMenu.lunch}</p>
          </div>
          <div class="p-3 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-900/40">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[11px] font-bold text-orange-700 dark:text-orange-300 flex items-center gap-1">
                <i data-lucide="cookie" class="w-3.5 h-3.5"></i> Snacks
              </span>
              <span class="text-[10px] text-slate-400">5:00 - 6:00 PM</span>
            </div>
            <p class="text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-2">${todayMenu.snacks}</p>
          </div>
          <div class="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-900/40">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                <i data-lucide="moon" class="w-3.5 h-3.5"></i> Dinner
              </span>
              <span class="text-[10px] text-slate-400">8:00 - 9:45 PM</span>
            </div>
            <p class="text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-2">${todayMenu.dinner}</p>
          </div>
        </div>
        ${todayMenu.note ? `
          <div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-2">
            <i data-lucide="sparkles" class="w-3.5 h-3.5 flex-shrink-0"></i>
            <span><strong>Chef's Note:</strong> ${todayMenu.note}</span>
          </div>
        ` : ''}
      `;
    }
  }

  // Render Admin Enrolled Students live widget if user is administrator
  if (currentUser && currentUser.role === 'admin') {
    const adminWidget = document.getElementById('admin-home-students-widget');
    const badgeEl = document.getElementById('home-admin-student-badge');
    const listEl = document.getElementById('home-admin-students-list');
    const students = getStudents();

    if (adminWidget) adminWidget.classList.remove('hidden');
    if (badgeEl) badgeEl.textContent = `${students.length} Student${students.length !== 1 ? 's' : ''}`;

    const navBadge = document.getElementById('nav-student-count-badge');
    if (navBadge) navBadge.textContent = students.length;

    if (listEl) {
      if (students.length === 0) {
        listEl.innerHTML = '<p class="text-xs text-slate-400 italic col-span-3">No students registered yet. New student accounts will appear here automatically.</p>';
      } else {
        listEl.innerHTML = students.slice(0, 12).map(s => {
          const avatar = s.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=faces';
          const name = escapeHtml(s.name || 'Student');
          const roll = escapeHtml(s.roll || 'N/A');
          const branch = escapeHtml(s.branch || 'Data Science & AI');
          return `
            <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-3 hover:border-emerald-500/50 transition">
              <div class="flex items-center gap-2.5 truncate">
                <img src="${avatar}" alt="${name}" class="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 flex-shrink-0" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=faces'" />
                <div class="truncate">
                  <div class="font-bold text-xs text-slate-900 dark:text-slate-100 truncate flex items-center gap-1.5">
                    <span>${name}</span>
                    <span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold">${roll}</span>
                  </div>
                  <p class="text-[10px] text-slate-400 truncate mt-0.5">${branch}</p>
                </div>
              </div>
              <button type="button" onclick="removeStudentAccount('${s.id}', '${name}', '${roll}')" class="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition" title="Remove student">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          `;
        }).join('');
      }
    }
  } else {
    const adminWidget = document.getElementById('admin-home-students-widget');
    if (adminWidget) adminWidget.classList.add('hidden');
  }

  // 4. Academic Tasks: Pending Assignments
  const assignments = getGlobalAssignments();
  const userRoll = currentUser?.roll || '';
  const normRoll = userRoll ? userRoll.trim().toUpperCase() : '';
  const pendingAssignments = assignments.filter(a => {
    const isCompleted = (a.completedBy && a.completedBy.some(r => String(r).trim().toUpperCase() === normRoll)) || a.status === 'Completed';
    return !isCompleted;
  }).slice(0, 3);

  const assignContainer = document.getElementById('home-pending-assignments');
  if (assignContainer) {
    if (pendingAssignments.length === 0) {
      assignContainer.innerHTML = `
        <div class="p-6 text-center text-slate-400 text-xs bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <i data-lucide="check-check" class="w-6 h-6 text-emerald-500 mx-auto mb-1"></i>
          <span>All course assignments completed! Great job.</span>
        </div>
      `;
    } else {
      assignContainer.innerHTML = pendingAssignments.map(a => {
        const priorityColor = a.priority === 'High' ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40' : (a.priority === 'Low' ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' : 'text-amber-500 bg-amber-50 dark:bg-amber-950/40');
        return `
          <div onclick="navigateTo('planner')" class="cursor-pointer flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-indigo-500/40 transition">
            <div class="truncate mr-2">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-slate-900 dark:text-white truncate">${a.title}</span>
                <span class="text-[10px] font-bold px-1.5 py-0.2 rounded ${priorityColor}">${a.priority || 'Medium'}</span>
              </div>
              <p class="text-[11px] text-slate-400 truncate">${a.subject} • Due ${formatDate(a.dueDate)}</p>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400 flex-shrink-0"></i>
          </div>
        `;
      }).join('');
    }
  }

  // 5. Upcoming Exams
  const exams = getExams().slice(0, 3);
  const examsContainer = document.getElementById('home-upcoming-exams');
  if (examsContainer) {
    if (exams.length === 0) {
      examsContainer.innerHTML = `
        <div class="p-6 text-center text-slate-400 text-xs bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <i data-lucide="calendar" class="w-6 h-6 text-purple-500 mx-auto mb-1"></i>
          <span>No upcoming examinations announced.</span>
        </div>
      `;
    } else {
      examsContainer.innerHTML = exams.map(ex => {
        const diffDays = Math.ceil((new Date(ex.examDate) - new Date()) / (1000 * 60 * 60 * 24));
        const countdownStr = diffDays > 0 ? `In ${diffDays} days` : (diffDays === 0 ? 'Today' : 'Concluded');
        return `
          <div onclick="navigateTo('planner'); switchPlannerTab('exams');" class="cursor-pointer flex items-center justify-between p-3 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 hover:border-purple-500/40 transition">
            <div class="truncate mr-2">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-slate-900 dark:text-white truncate">${ex.subject}</span>
                <span class="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">${countdownStr}</span>
              </div>
              <p class="text-[11px] text-slate-400 truncate">${ex.title} • ${formatDate(ex.examDate)} (${ex.room || 'Room 203'})</p>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-purple-400 flex-shrink-0"></i>
          </div>
        `;
      }).join('');
    }
  }

  // 6. Featured Announcement
  const announcements = getAnnouncements();
  const featEl = document.getElementById('home-featured-announcement');
  if (featEl && announcements.length > 0) {
    const topNotice = announcements[0];
    featEl.innerHTML = `
      <div class="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
        <div class="flex items-center justify-between mb-1.5">
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-600 dark:text-rose-400">${topNotice.category}</span>
          <span class="text-xs text-slate-500">${topNotice.date}</span>
        </div>
        <h4 class="font-bold text-sm text-slate-900 dark:text-white">${topNotice.title}</h4>
        <p class="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">${topNotice.body}</p>
        <div class="mt-3 flex items-center justify-between text-[11px] text-slate-400">
          <span>By ${topNotice.author}</span>
          <button onclick="navigateTo('announcements')" class="text-rose-600 dark:text-rose-400 font-semibold hover:underline">Read All &rarr;</button>
        </div>
      </div>
    `;
  }

  lucide.createIcons();
}

// --- B. STUDY RESOURCES VIEW (Mockup 2) ---
let isBookmarkedFilterActive = false;

function toggleBookmarkedFilter() {
  isBookmarkedFilterActive = !isBookmarkedFilterActive;
  const btn = document.getElementById('btn-toggle-bookmarks');
  const label = document.getElementById('bookmarks-filter-label');
  if (btn) {
    if (isBookmarkedFilterActive) {
      btn.className = "px-3.5 py-2.5 bg-amber-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm";
      if (label) label.textContent = "Bookmarked (Active)";
    } else {
      btn.className = "px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition flex items-center gap-1.5";
      if (label) label.textContent = "Bookmarked";
    }
  }
  renderResourcesView();
}

function renderResourcesView() {
  const resources = getResources();
  const search = (document.getElementById('resource-search-input')?.value || '').toLowerCase().trim();
  const cat = document.getElementById('resource-category-filter')?.value || 'all';
  const unit = document.getElementById('resource-unit-filter')?.value || 'all';
  const typeFilter = document.getElementById('resource-type-filter')?.value || 'all';
  const isAdmin = currentUser && currentUser.role === 'admin';

  const filtered = resources.filter(r => {
    const matchesSearch = !search || 
      (r.subject && r.subject.toLowerCase().includes(search)) || 
      (r.title && r.title.toLowerCase().includes(search)) || 
      (r.description && r.description.toLowerCase().includes(search));
    const matchesCat = (cat === 'all') || (r.subject === cat);
    const matchesUnit = (unit === 'all') || (r.unit && r.unit.toLowerCase().includes(unit.toLowerCase()));
    const matchesType = (typeFilter === 'all') || (r.type && r.type.toLowerCase() === typeFilter.toLowerCase());
    const matchesBookmark = !isBookmarkedFilterActive || !!r.isBookmarked;

    return matchesSearch && matchesCat && matchesUnit && matchesType && matchesBookmark;
  });

  const container = document.getElementById('resources-list-container');
  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <i data-lucide="book-x" class="w-12 h-12 text-slate-400 mx-auto mb-3"></i>
        <h3 class="font-bold text-slate-700 dark:text-slate-300">No resources found</h3>
        <p class="text-xs text-slate-400 mt-1">${isAdmin ? 'Upload course materials using the button below.' : 'No materials matched the chosen filters.'}</p>
        ${isAdmin ? `<button onclick="openAddResourceModal()" class="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl shadow">+ Upload Resource (Admin)</button>` : ''}
      </div>
    `;
    lucide.createIcons();
    return;
  }

  const getSubjectIconColor = (subject) => {
    if (subject.includes('Mathematics')) return 'bg-rose-600 text-white';
    if (subject.includes('Programming')) return 'bg-purple-600 text-white';
    if (subject.includes('Digital Logic')) return 'bg-emerald-600 text-white';
    if (subject.includes('Physics')) return 'bg-slate-600 text-white';
    if (subject.includes('Communication')) return 'bg-blue-600 text-white';
    return 'bg-indigo-600 text-white';
  };

  container.innerHTML = filtered.map(r => `
    <div class="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-start sm:items-center gap-4">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getSubjectIconColor(r.subject || '')} shadow-md">
          <i data-lucide="book" class="w-6 h-6"></i>
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-1">
            <h3 class="font-bold text-slate-900 dark:text-white text-base">${r.subject}</h3>
            <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">${r.semester || 'Sem 1'}</span>
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              ${r.unit || 'Unit 1-4'}
            </span>
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              ${r.type || 'Notes'}
            </span>
          </div>
          <p class="text-xs font-semibold text-slate-800 dark:text-slate-200">${r.title}</p>
          <p class="text-xs text-slate-400 mt-1 line-clamp-1">${r.description || 'Official course syllabus & reference materials.'}</p>
          <div class="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
            <span class="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
              <i data-lucide="shield-check" class="w-3.5 h-3.5 text-blue-500"></i> ${r.contributor || 'Academic Affairs'}
            </span>
            <span>•</span>
            <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3"></i> ${r.date || 'Recent'}</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 self-start md:self-auto flex-wrap">
        <a href="${r.link}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm">
          <i data-lucide="file-text" class="w-3.5 h-3.5"></i> Notes (${r.notesCount || 12})
        </a>
        <a href="${r.link}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm">
          <i data-lucide="archive" class="w-3.5 h-3.5"></i> Papers (${r.papersCount || 6})
        </a>
        <button onclick="toggleBookmark('${r.id}')" title="${r.isBookmarked ? 'Remove Bookmark' : 'Bookmark Resource'}" class="p-2 border border-slate-200 dark:border-slate-800 rounded-xl transition ${r.isBookmarked ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800' : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'}">
          <i data-lucide="bookmark" class="w-4 h-4 ${r.isBookmarked ? 'fill-amber-500' : ''}"></i>
        </button>
        <button onclick="copyResourceLink('${r.link}')" title="Copy Link" class="p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <i data-lucide="share-2" class="w-4 h-4"></i>
        </button>
        <button onclick="openReportResourceModal('${r.id}', '${r.title.replace(/'/g, "\\'")}')" title="Report broken link or issue" class="p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition">
          <i data-lucide="flag" class="w-4 h-4"></i>
        </button>
        ${isAdmin ? `
          <button onclick="deleteResource('${r.id}')" title="Delete Resource (Admin)" class="p-2 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        ` : ''}
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

function filterResources() {
  renderResourcesView();
}

async function toggleBookmark(id) {
  const resources = getResources();
  const res = resources.find(r => r.id === id);
  if (res) {
    res.isBookmarked = !res.isBookmarked;
    setResources(resources);
    if (isBackendConnected) {
      const roll = currentUser?.roll ? currentUser.roll.trim().toUpperCase() : '24DSAI001';
      await apiCall(`/resources/${id}/bookmark`, 'POST', { roll });
    }
    showToast(res.isBookmarked ? 'Resource bookmarked!' : 'Bookmark removed.', 'info');
    renderResourcesView();
  }
}

function openReportResourceModal(id, title) {
  const modal = document.getElementById('modal-report-resource');
  const idInput = document.getElementById('report-resource-id');
  const titleEl = document.getElementById('report-resource-title');
  if (idInput) idInput.value = id;
  if (titleEl) titleEl.textContent = title;
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

async function submitResourceReport(event) {
  event.preventDefault();
  const id = document.getElementById('report-resource-id').value;
  const reason = document.getElementById('report-reason-select').value;
  const details = document.getElementById('report-details')?.value.trim();

  if (isBackendConnected) {
    await apiCall(`/resources/${id}/report`, 'POST', {
      roll: currentUser?.roll || '24DSAI001',
      reason: `${reason}${details ? ' - ' + details : ''}`
    });
  }
  closeModal('modal-report-resource');
  showToast('Thank you! Your report has been submitted to the academic administration for verification.', 'success');
}

function openAddResourceModal() {
  if (!currentUser) {
    showToast('Please sign in to upload study resources.', 'error');
    return;
  }
  document.getElementById('modal-add-resource').classList.remove('hidden');
  document.getElementById('modal-add-resource').classList.add('flex');
}

async function submitNewResource(event) {
  event.preventDefault();
  if (!currentUser) {
    showToast('Please sign in to upload study resources.', 'error');
    return;
  }

  const subject = document.getElementById('res-subject').value;
  const title = document.getElementById('res-title').value.trim();
  const type = document.getElementById('res-type').value;
  const sem = document.getElementById('res-sem').value.trim();
  const unit = document.getElementById('res-unit')?.value || 'Unit 1-4';
  const link = document.getElementById('res-link').value.trim();
  const desc = document.getElementById('res-desc').value.trim();

  const contributorName = currentUser.role === 'admin' 
    ? `Admin (${currentUser.name})` 
    : `Student (${currentUser.name}, ${currentUser.roll || ''})`;

  const resources = getResources();
  const newRes = {
    id: 'res_' + Date.now(),
    subject: subject,
    title: title,
    type: type,
    semester: sem,
    unit: unit,
    link: link,
    notesCount: Math.floor(Math.random() * 8) + 4,
    papersCount: Math.floor(Math.random() * 5) + 3,
    contributor: contributorName,
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    description: desc,
    isBookmarked: false
  };

  resources.unshift(newRes);
  setResources(resources);
  
  if (isBackendConnected) {
    await apiCall('/resources', 'POST', {
      subject, title, type, semester: sem, unit, link, description: desc, authorName: contributorName
    });
  }

  closeModal('modal-add-resource');
  showToast('Study resource published to academic library!', 'success');
  renderResourcesView();
}

function deleteResource(id) {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only Admin can delete resources.', 'error');
    return;
  }
  let resources = getResources();
  resources = resources.filter(r => r.id !== id);
  setResources(resources);
  apiCall(`/resources/${id}`, 'DELETE');
  showToast('Study resource deleted successfully.', 'info');
  renderResourcesView();
}

function copyResourceLink(url) {
  navigator.clipboard.writeText(url).then(() => {
    showToast('Resource link copied to clipboard!', 'info');
  }).catch(() => {
    showToast(`Resource URL: ${url}`, 'info');
  });
}

// --- C. TIMETABLE VIEW (Mockup 3) ---
// Requirement 2: Timetable which can be edited ONLY by admin
let isTimetableFitMode = true;

function toggleTimetableFitMode() {
  const container = document.getElementById('timetable-table-container');
  const table = document.getElementById('timetable-grid-table');
  const label = document.getElementById('tt-fit-btn-label');
  const icon = document.getElementById('icon-timetable-fit');
  if (!container) return;

  isTimetableFitMode = !isTimetableFitMode;
  if (isTimetableFitMode) {
    container.classList.add('timetable-fit-mode');
    if (table) {
      table.classList.add('table-fixed');
      table.classList.remove('min-w-[980px]');
      table.classList.add('min-w-[700px]', 'md:min-w-0');
    }
    if (label) label.textContent = 'Fit to Screen: ON';
    if (icon) icon.setAttribute('data-lucide', 'minimize-2');
  } else {
    container.classList.remove('timetable-fit-mode');
    if (table) {
      table.classList.remove('table-fixed', 'md:min-w-0');
      table.classList.add('min-w-[980px]');
    }
    if (label) label.textContent = 'Fit to Screen: OFF';
    if (icon) icon.setAttribute('data-lucide', 'maximize-2');
  }
  if (window.lucide) lucide.createIcons();
}

function renderTimetableSlotCard(slot, dayName, time, defaultRoom, isAdmin) {
  const subject = (slot?.subject || '-').trim();
  const room = (slot?.room && slot?.room !== '-' ? slot.room : (defaultRoom || '')).trim();

  // 1. Precise Lunch Detection (1:00 - 2:00 or explicit lunch type)
  const sUpper = subject.toUpperCase();
  const isLunch = time === '1:00 - 2:00' || 
                  slot?.type === 'lunch' || 
                  sUpper === 'LUNCH' || 
                  sUpper.includes('LUNCH BREAK') ||
                  (slot?.room === 'Mess' && ['L', 'U', 'N', 'C', 'H'].includes(sUpper));

  // 2. Precise Free Slot Detection
  const isFree = !isLunch && (subject === '-' || slot?.type === 'free' || sUpper === 'FREE' || sUpper.startsWith('FREE /') || sUpper === 'FREE STUDY HOUR');

  // 3. Determine Slot Color & Class
  const slotType = isLunch ? 'lunch' : (isFree ? 'free' : (slot?.type || getSlotType(subject)));
  const slotClass = `slot-${slotType}`;
  const desc = SLOT_DESCRIPTIONS[subject] || subject;
  const tooltipText = isLunch ? `Lunch Break (1:00 PM - 2:00 PM)` : `${subject}${room ? ` (Room: ${room})` : ''} | ${time}`;

  // 4. Construct Card HTML ensuring subject and room are clearly displayed
  let contentHtml = '';

  if (isLunch) {
    let letter = 'Lunch';
    const m = subject.match(/\(([A-Z])\)/i);
    if (m) letter = m[1].toUpperCase();
    else if (['L', 'U', 'N', 'C', 'H'].includes(sUpper)) letter = sUpper;

    contentHtml = `
      <span class="font-black text-sm sm:text-base leading-none tracking-widest text-rose-600 dark:text-rose-300">${letter}</span>
      <span class="text-[8px] sm:text-[9px] uppercase font-bold opacity-80 leading-tight mt-0.5">Lunch</span>
    `;
  } else if (isFree) {
    contentHtml = `
      <span class="text-xs sm:text-sm font-semibold opacity-30 leading-none">-</span>
      <span class="text-[8px] sm:text-[9px] opacity-40 font-medium leading-tight mt-0.5">Free</span>
    `;
  } else {
    // Subject has structure like "Slot A (Data Structures)" or "C (IOT)" or "Slot B (OOP with Java)"
    const parenMatch = subject.match(/^([^(]+?)\s*\(([^)]+)\)$/);
    if (parenMatch) {
      const mainPart = parenMatch[1].trim();
      const detailPart = parenMatch[2].trim();
      contentHtml = `
        <span class="font-extrabold text-[10px] sm:text-[11px] leading-tight block truncate w-full px-0.5 uppercase tracking-tight">${mainPart}</span>
        <span class="font-medium text-[8.5px] sm:text-[9.5px] opacity-95 leading-tight block truncate w-full px-0.5 mt-0.5" title="${detailPart}">${detailPart}</span>
        ${room ? `<span class="text-[7.5px] sm:text-[8px] opacity-75 font-medium leading-none block truncate w-full mt-0.5">(${room})</span>` : ''}
      `;
    } else if (subject.length <= 4) {
      // Short code like "A", "B", "C", "F", "G", "M", "N", "ILC"
      contentHtml = `
        <span class="font-black text-xs sm:text-sm leading-none block uppercase">${subject}</span>
        ${room ? `<span class="text-[8px] sm:text-[9px] opacity-80 font-medium leading-none block truncate w-full mt-0.5">(${room})</span>` : ''}
      `;
    } else {
      // General subject name (e.g. "Operating Systems", "Music", "Creative Arts", "Data Structures")
      contentHtml = `
        <span class="font-bold text-[9.5px] sm:text-[10.5px] leading-tight block truncate w-full px-0.5" title="${subject}">${subject}</span>
        ${room ? `<span class="text-[8px] sm:text-[9px] opacity-80 font-medium leading-none block truncate w-full mt-0.5">(${room})</span>` : ''}
      `;
    }
  }

  const safeSubject = subject.replace(/'/g, "\\'");
  const safeRoom = (room || defaultRoom).replace(/'/g, "\\'");

  return `
    <td class="p-0.5 sm:p-1 align-middle text-center">
      <div onclick="handleTimetableSlotClick('${dayName}', '${time}', '${safeSubject}', '${safeRoom}')" 
           title="${tooltipText.replace(/"/g, '&quot;')}"
           class="tt-slot ${slotClass} group relative cursor-pointer select-none">
        ${contentHtml}
        ${isAdmin ? `<span class="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition text-[7px] bg-black/70 text-white rounded px-0.5 leading-tight">edit</span>` : ''}
      </div>
    </td>
  `;
}

function renderTimetableView() {
  const timetable = getTimetable(activeTimetableBranch);
  const tbody = document.getElementById('timetable-table-body');
  if (!tbody) return;

  const isAdmin = currentUser && currentUser.role === 'admin';

  // 1. Highlight the active branch tab
  const tabDsai = document.getElementById('tt-tab-dsai');
  const tabCse = document.getElementById('tt-tab-cse');
  const tabEce = document.getElementById('tt-tab-ece');

  const activeTabClass = "px-3 py-1.5 text-xs font-bold rounded-xl transition shadow-sm bg-indigo-600 text-white flex items-center gap-1.5";
  const inactiveTabClass = "px-3 py-1.5 text-xs font-bold rounded-xl transition bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 border border-slate-200 dark:border-slate-700";

  if (tabDsai) tabDsai.className = activeTimetableBranch === 'Data Science & AI' ? activeTabClass : inactiveTabClass;
  if (tabCse) tabCse.className = activeTimetableBranch === 'Computer Science & Engineering' ? activeTabClass : inactiveTabClass;
  if (tabEce) tabEce.className = activeTimetableBranch === 'Electronics & Communication' ? activeTabClass : inactiveTabClass;

  // 2. Update room badge and subtitle
  const roomBadge = document.getElementById('timetable-room-badge');
  const subTitle = document.getElementById('timetable-subtitle');
  const defaultRoom = activeTimetableBranch.includes('Computer') ? '201' : (activeTimetableBranch.includes('Electronics') ? '205' : '203');
  const branchShort = activeTimetableBranch.includes('Data') ? 'DSAI' : (activeTimetableBranch.includes('Computer') ? 'CSE' : 'ECE');

  if (roomBadge) roomBadge.textContent = `Room No: ${defaultRoom}`;
  if (subTitle) subTitle.textContent = `B.Tech Official Schedule (${branchShort}) • ${activeTimetableBranch} (w.e.f. 24/08/2026 | IIIT Naya Raipur).`;

  tbody.innerHTML = timetable.map((dayRow) => {
    const dayName = dayRow.day;
    const isHidden = (currentMobileTimetableDay !== 'all' && currentMobileTimetableDay !== dayName);
    const cells = TIMETABLE_PERIODS.map(time => {
      const slot = dayRow.periods?.[time] || { subject: '-', room: defaultRoom, type: 'free' };
      return renderTimetableSlotCard(slot, dayName, time, defaultRoom, isAdmin);
    }).join('');

    return `
      <tr data-day="${dayName}" class="${isHidden ? 'hidden md:table-row ' : ''}hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
        <td class="py-2 px-1.5 font-bold text-[10px] sm:text-xs text-slate-800 dark:text-slate-200 text-left bg-slate-50/70 dark:bg-slate-800/50 border-r border-slate-100 dark:border-slate-800 whitespace-nowrap">
          ${dayName}
        </td>
        ${cells}
      </tr>
    `;
  }).join('');

  // Render touch-operable mobile timetable cards
  renderMobileTimetableCards();
  updateMobileTimetableView();

  if (window.lucide) lucide.createIcons();
}

function renderMobileTimetableCards() {
  const container = document.getElementById('mobile-timetable-cards-container');
  if (!container) return;

  const timetable = getTimetable(activeTimetableBranch);
  const isAdmin = currentUser && currentUser.role === 'admin';
  const defaultRoom = activeTimetableBranch.includes('Computer') ? '201' : (activeTimetableBranch.includes('Electronics') ? '205' : '203');
  const branchShort = activeTimetableBranch.includes('Data') ? 'DSAI' : (activeTimetableBranch.includes('Computer') ? 'CSE' : 'ECE');

  const daysToShow = currentMobileTimetableDay === 'all' 
    ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    : [currentMobileTimetableDay];

  const now = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayDayName = dayNames[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  function isLiveNow(day, timeStr) {
    if (day !== todayDayName) return false;
    const parts = timeStr.split('-');
    if (parts.length !== 2) return false;
    function parseMinutes(str) {
      const match = str.trim().match(/(\d+):(\d+)/);
      if (!match) return -1;
      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      if (h >= 1 && h <= 6) h += 12; // 1:00 PM to 6:00 PM
      return h * 60 + m;
    }
    const startM = parseMinutes(parts[0]);
    const endM = parseMinutes(parts[1]);
    if (startM < 0 || endM < 0) return false;
    return currentMinutes >= startM && currentMinutes <= endM;
  }

  let html = '';

  daysToShow.forEach(day => {
    const dayRow = timetable.find(r => r.day === day) || { day: day, periods: {} };
    const isToday = (day === todayDayName);

    html += `
      <div class="tt-mobile-day-section space-y-2 mb-3">
        <!-- Day Section Header with Mobile Badging -->
        <div class="flex items-center justify-between px-3 py-2 bg-slate-100/90 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full ${isToday ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-500'}"></span>
            <span class="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">${day}</span>
            ${isToday ? `<span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">TODAY</span>` : ''}
          </div>
          <span class="text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700/70 px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-600 shadow-2xs">
            ${branchShort} • Room ${defaultRoom}
          </span>
        </div>

        <div class="space-y-2.5">
    `;

    TIMETABLE_PERIODS.forEach((time, periodIndex) => {
      const slot = dayRow.periods?.[time] || { subject: '-', room: defaultRoom, type: 'free' };
      const subject = (slot?.subject || '-').trim();
      const room = (slot?.room && slot?.room !== '-' ? slot.room : (defaultRoom || '')).trim();

      const sUpper = subject.toUpperCase();
      const isLunch = time === '1:00 - 2:00' || 
                      slot?.type === 'lunch' || 
                      sUpper === 'LUNCH' || 
                      sUpper.includes('LUNCH BREAK') ||
                      (slot?.room === 'Mess' && ['L', 'U', 'N', 'C', 'H'].includes(sUpper));
      const isFree = !isLunch && (subject === '-' || slot?.type === 'free' || sUpper === 'FREE' || sUpper.startsWith('FREE /') || sUpper === 'FREE STUDY HOUR');
      const slotType = isLunch ? 'lunch' : (isFree ? 'free' : (slot?.type || getSlotType(subject)));
      const live = isLiveNow(day, time);

      let periodNumber = `P${periodIndex + 1}`;
      let slotLetter = isLunch ? 'L' : (isFree ? '-' : slotType.toUpperCase());
      if (time === '1:00 - 2:00') {
        periodNumber = 'LUNCH';
      } else if (periodIndex > 4) {
        periodNumber = `P${periodIndex}`;
      }

      let displayTitle = subject;
      let subDesc = '';
      let slotCodeBadge = '';

      if (isLunch) {
        displayTitle = 'Lunch Break';
        subDesc = 'Hostel Dining Hall / Mess / Cafeteria';
        slotCodeBadge = '<span class="tt-mobile-badge bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800">Lunch</span>';
      } else if (isFree) {
        displayTitle = 'Free Study Slot';
        subDesc = 'Self Study / Library / Project Preparation';
        slotCodeBadge = '<span class="tt-mobile-badge bg-slate-100 text-slate-600 dark:bg-slate-700/80 dark:text-slate-300 border border-slate-300 dark:border-slate-600">Free</span>';
      } else {
        const parenMatch = subject.match(/^([^(]+?)\s*\(([^)]+)\)$/);
        if (parenMatch) {
          displayTitle = parenMatch[1].trim();
          subDesc = parenMatch[2].trim();
        } else if (SLOT_DESCRIPTIONS[subject]) {
          const fullDesc = SLOT_DESCRIPTIONS[subject];
          const colonSplit = fullDesc.split(':');
          if (colonSplit.length > 1) {
            displayTitle = colonSplit[1].trim();
            subDesc = colonSplit[0].trim();
          } else {
            displayTitle = fullDesc;
          }
        }

        const badgeColors = {
          'a': 'bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300 border-red-300 dark:border-red-800',
          'b': 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300 dark:border-purple-800',
          'c': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
          'f': 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600',
          'g': 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-800',
          'm': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
          'n': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800',
          'music': 'bg-pink-100 text-pink-700 dark:bg-pink-950/80 dark:text-pink-300 border-pink-300 dark:border-pink-800',
          'yoga': 'bg-pink-100 text-pink-700 dark:bg-pink-950/80 dark:text-pink-300 border-pink-300 dark:border-pink-800',
          'ilc': 'bg-pink-100 text-pink-700 dark:bg-pink-950/80 dark:text-pink-300 border-pink-300 dark:border-pink-800'
        };
        const badgeClass = badgeColors[slotType] || 'bg-slate-100 text-slate-700 border-slate-300';
        slotCodeBadge = `<span class="tt-mobile-badge border ${badgeClass}">Slot ${slotType.toUpperCase()}</span>`;
      }

      const safeSubject = subject.replace(/'/g, "\\'");
      const safeRoom = (room || defaultRoom).replace(/'/g, "\\'");

      html += `
        <div class="tt-mobile-slot-card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 relative flex items-center justify-between gap-3 shadow-xs transition hover:border-indigo-400 dark:hover:border-indigo-600 cursor-pointer ${live ? 'ring-2 ring-emerald-500/80 dark:ring-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/30' : ''}"
             onclick="handleTimetableMobileCardClick(event, '${day}', '${time}', '${safeSubject}', '${safeRoom}')">
          <!-- Left color accent strip -->
          <div class="tt-mobile-accent-strip tt-mobile-accent-${slotType}"></div>

          <!-- Content block -->
          <div class="flex items-center gap-3 pl-2 flex-1 min-w-0">
            <!-- Period indicator square -->
            <div class="flex flex-col items-center justify-center w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 flex-shrink-0">
              <span class="text-[9px] font-extrabold uppercase text-slate-500 dark:text-slate-400 leading-tight">${periodNumber}</span>
              <span class="text-xs font-black ${isLunch ? 'text-rose-600 dark:text-rose-400' : (isFree ? 'text-slate-400' : 'text-indigo-600 dark:text-indigo-400')} uppercase">${slotLetter}</span>
            </div>

            <!-- Subject & Room Details -->
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[190px] sm:max-w-xs">${displayTitle}</span>
                ${slotCodeBadge}
                ${live ? `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 animate-pulse"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> LIVE</span>` : ''}
              </div>
              <div class="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                <span class="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                  <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-400"></i> ${time}
                </span>
                ${room ? `
                <span class="flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-900/60 px-2 py-0.5 rounded-lg text-[10px]">
                  <i data-lucide="map-pin" class="w-3 h-3 text-indigo-500"></i> Room ${room}
                </span>` : ''}
              </div>
              ${subDesc ? `<div class="text-[10.5px] text-slate-500 dark:text-slate-400 truncate mt-0.5">${subDesc}</div>` : ''}
            </div>
          </div>

          <!-- Right Action button -->
          <div class="flex items-center gap-1 flex-shrink-0">
            ${isAdmin ? `
              <button type="button" 
                      onclick="event.stopPropagation(); openAddTimetableSlotModal('${day}', '${time}', '${safeSubject}', '${safeRoom}')"
                      class="tt-mobile-admin-btn p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-700/80 dark:hover:bg-indigo-950/80 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-600 transition"
                      title="Admin Edit Slot">
                <i data-lucide="edit-3" class="w-4 h-4 text-indigo-600 dark:text-indigo-400"></i>
              </button>
            ` : `
              <span class="text-slate-400 dark:text-slate-500 p-1">
                <i data-lucide="chevron-right" class="w-4 h-4"></i>
              </span>
            `}
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  if (window.lucide) lucide.createIcons();
}

function handleTimetableMobileCardClick(event, day, time, subject, room) {
  if (currentUser && currentUser.role === 'admin') {
    openAddTimetableSlotModal(day, time, subject, room);
  } else {
    const fullDesc = SLOT_DESCRIPTIONS[subject] || subject;
    const isLunch = time === '1:00 - 2:00' || subject.toUpperCase() === 'LUNCH';
    const msg = isLunch 
      ? `🍽️ Lunch Break: 1:00 PM - 2:00 PM (Hostel Dining Hall / Mess)`
      : `📅 ${day} • ${time} • ${fullDesc} (Room ${room || 'Campus'})`;
    showToast(msg, 'info');
  }
}

function handleTimetableSlotClick(day, time, subject, room) {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('🔒 Timetable can only be edited by College Administration.', 'error');
    return;
  }
  // Open editor prefilled for this slot
  openAddTimetableSlotModal(day, time, subject, room);
}

function openAddTimetableSlotModal(day, time, subject, room) {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only Admin can edit timetable!', 'error');
    return;
  }

  const branchEl = document.getElementById('tt-branch');
  if (branchEl) branchEl.value = activeTimetableBranch;

  const defaultRoom = activeTimetableBranch.includes('Computer') ? '201' : (activeTimetableBranch.includes('Electronics') ? '205' : '203');

  if (day) document.getElementById('tt-day').value = day;
  if (time) document.getElementById('tt-time').value = time;
  if (subject) document.getElementById('tt-subject').value = subject;
  document.getElementById('tt-room').value = room || defaultRoom;

  document.getElementById('modal-edit-timetable').classList.remove('hidden');
  document.getElementById('modal-edit-timetable').classList.add('flex');
}

async function submitTimetableSlot(event) {
  event.preventDefault();
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only Admin can modify schedule.', 'error');
    return;
  }

  const branch = document.getElementById('tt-branch')?.value || activeTimetableBranch;
  const day = document.getElementById('tt-day').value;
  const time = document.getElementById('tt-time').value;
  const subject = document.getElementById('tt-subject').value.trim();
  const room = document.getElementById('tt-room').value.trim();

  const isLunch = time === '1:00 - 2:00' || subject.toUpperCase() === 'LUNCH';
  const type = isLunch ? 'lunch' : (subject === '-' ? 'free' : getSlotType(subject));

  // 1. Update in-memory / local storage immediately
  const timetable = getTimetable(branch);
  let dayRow = timetable.find(r => r.day === day);
  if (!dayRow) {
    dayRow = { day: day, periods: {} };
    timetable.push(dayRow);
  }
  if (!dayRow.periods) {
    dayRow.periods = {};
  }

  dayRow.periods[time] = {
    subject: subject,
    room: room,
    type: type
  };

  setTimetable(timetable, branch);

  // 2. Ensure activeTimetableBranch matches the edited branch so user immediately sees the change
  activeTimetableBranch = branch;

  closeModal('modal-edit-timetable');
  showToast(`Updated [${branch}] ${day} at ${time} -> ${subject} (${room})`, 'success');

  // 3. Render immediately
  renderTimetableView();
  renderHomeView();

  // 4. Persist to SQLite backend & re-fetch to confirm
  try {
    const res = await apiCall('/timetable/slot', 'POST', {
      branch, day, time, subject, room, type
    });
    if (res?.success) {
      const refetch = await apiCall(`/timetable?branch=${encodeURIComponent(branch)}`, 'GET');
      if (refetch?.success && refetch.timetable) {
        setTimetable(refetch.timetable, branch);
        renderTimetableView();
        renderHomeView();
      }
    }
  } catch (err) {
    console.error('Timetable sync error:', err);
  }
}

async function resetDefaultTimetable() {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied.', 'error');
    return;
  }
  if (confirm(`Reset timetable for ${activeTimetableBranch} to official IIIT-NR default schedule?`)) {
    const defaultData = (DEFAULT_BRANCH_TIMETABLES && DEFAULT_BRANCH_TIMETABLES[activeTimetableBranch]) || DEFAULT_TIMETABLE;
    setTimetable(JSON.parse(JSON.stringify(defaultData)), activeTimetableBranch);
    renderTimetableView();
    renderHomeView();
    showToast(`Timetable for ${activeTimetableBranch} reset to official schedule.`, 'info');

    try {
      await apiCall('/timetable/reset', 'POST', { branch: activeTimetableBranch });
      const refetch = await apiCall(`/timetable?branch=${encodeURIComponent(activeTimetableBranch)}`, 'GET');
      if (refetch?.success && refetch.timetable) {
        setTimetable(refetch.timetable, activeTimetableBranch);
        renderTimetableView();
        renderHomeView();
      }
    } catch (e) {
      console.error('Reset error:', e);
    }
  }
}

// --- D. ASSIGNMENT & EXAM PLANNER VIEW ---
let activePlannerTab = 'assignments';
let currentAssignmentStatusFilter = 'all';
let currentAssignmentPriorityFilter = 'All';
let currentAssignmentSearchQuery = '';

function switchPlannerTab(tab) {
  activePlannerTab = tab;
  const btnAssign = document.getElementById('planner-tab-btn-assignments');
  const btnExams = document.getElementById('planner-tab-btn-exams');
  const secAssign = document.getElementById('planner-section-assignments');
  const secExams = document.getElementById('planner-section-exams');

  if (tab === 'assignments') {
    if (btnAssign) btnAssign.className = "flex-1 py-2 text-xs font-bold rounded-xl transition bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm flex items-center justify-center gap-2";
    if (btnExams) btnExams.className = "flex-1 py-2 text-xs font-bold rounded-xl transition text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-2";
    if (secAssign) secAssign.classList.remove('hidden');
    if (secExams) secExams.classList.add('hidden');
  } else {
    if (btnExams) btnExams.className = "flex-1 py-2 text-xs font-bold rounded-xl transition bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm flex items-center justify-center gap-2";
    if (btnAssign) btnAssign.className = "flex-1 py-2 text-xs font-bold rounded-xl transition text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-2";
    if (secExams) secExams.classList.remove('hidden');
    if (secAssign) secAssign.classList.add('hidden');
  }

  renderPlannerView();
}

function filterAssignmentStatus(status) {
  currentAssignmentStatusFilter = status;
  ['all', 'pending', 'progress', 'completed'].forEach(s => {
    const el = document.getElementById(`filter-assign-${s}`);
    if (el) {
      const match = (s === 'all' && status === 'all') || 
                    (s === 'pending' && status === 'Pending') ||
                    (s === 'progress' && status === 'In Progress') ||
                    (s === 'completed' && status === 'Completed');
      if (match) {
        el.className = "px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-600 text-white transition";
      } else {
        el.className = "px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition";
      }
    }
  });
  renderPlannerView();
}

function filterAssignmentPriority(val) {
  currentAssignmentPriorityFilter = val;
  renderPlannerView();
}

function searchAssignments(query) {
  currentAssignmentSearchQuery = (query || '').toLowerCase().trim();
  renderPlannerView();
}

function renderPlannerView() {
  const isAdmin = currentUser && currentUser.role === 'admin';
  const userRoll = currentUser?.roll || '';

  // Show/Hide Admin Schedule Exam button
  const adminExamBtn = document.getElementById('admin-add-exam-btn');
  if (adminExamBtn) {
    if (isAdmin) {
      adminExamBtn.classList.remove('hidden');
      adminExamBtn.classList.add('flex');
    } else {
      adminExamBtn.classList.add('hidden');
      adminExamBtn.classList.remove('flex');
    }
  }

  // --- SUBTAB 1: ASSIGNMENTS ---
  const assignments = getGlobalAssignments();
  const normRoll = userRoll ? userRoll.trim().toUpperCase() : '';
  const list = assignments.map(a => {
    const isCompleted = (a.completedBy && a.completedBy.some(r => String(r).trim().toUpperCase() === normRoll)) || a.status === 'Completed';
    return {
      ...a,
      status: isCompleted ? 'Completed' : (a.status || 'Pending'),
      priority: a.priority || 'Medium'
    };
  });

  const filtered = list.filter(a => {
    const matchesStatus = (currentAssignmentStatusFilter === 'all') || (a.status === currentAssignmentStatusFilter);
    const matchesPriority = (currentAssignmentPriorityFilter === 'All') || (a.priority === currentAssignmentPriorityFilter);
    const matchesSearch = !currentAssignmentSearchQuery || 
      (a.title && a.title.toLowerCase().includes(currentAssignmentSearchQuery)) ||
      (a.subject && a.subject.toLowerCase().includes(currentAssignmentSearchQuery)) ||
      (a.description && a.description.toLowerCase().includes(currentAssignmentSearchQuery));
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const tbody = document.getElementById('assignments-table-body');
  if (tbody) {
    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="py-12 text-center text-slate-400 text-xs">
            No course assignments match the current filter criteria. Click "+ Add Assignment" to record coursework.
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = filtered.map(a => {
        const isCompleted = a.status === 'Completed';
        const isProgress = a.status === 'In Progress';

        // Due date calculation & highlighting
        const dueObj = new Date(a.dueDate);
        const todayObj = new Date();
        todayObj.setHours(0,0,0,0);
        dueObj.setHours(0,0,0,0);
        const diffDays = Math.round((dueObj - todayObj) / (1000 * 60 * 60 * 24));

        let dueBadgeClass = 'text-slate-500 dark:text-slate-400';
        let dueNotice = '';
        if (!isCompleted) {
          if (diffDays < 0) {
            dueBadgeClass = 'text-rose-600 dark:text-rose-400 font-bold';
            dueNotice = '<span class="ml-1.5 px-1.5 py-0.2 rounded text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold">Overdue</span>';
          } else if (diffDays === 0) {
            dueBadgeClass = 'text-rose-600 dark:text-rose-400 font-bold';
            dueNotice = '<span class="ml-1.5 px-1.5 py-0.2 rounded text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold">Due Today</span>';
          } else if (diffDays <= 3) {
            dueBadgeClass = 'text-amber-600 dark:text-amber-400 font-bold';
            dueNotice = `<span class="ml-1.5 px-1.5 py-0.2 rounded text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">${diffDays}d left</span>`;
          }
        }

        const priorityBadge = a.priority === 'High'
          ? `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">🔥 High</span>`
          : (a.priority === 'Low'
              ? `<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">🌱 Low</span>`
              : `<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">⚡ Medium</span>`);

        const statusBadge = isCompleted
          ? `<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Completed</span>`
          : (isProgress
              ? `<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">In Progress</span>`
              : `<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Pending</span>`);

        return `
          <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
            <td class="py-4 px-4 text-center">
              <input type="checkbox" ${isCompleted ? 'checked' : ''} onchange="toggleAssignmentStatus('${a.id}')" class="w-4 h-4 text-indigo-600 rounded cursor-pointer transition focus:ring-indigo-500" />
            </td>
            <td class="py-4 px-4">
              <div class="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <span class="${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''}">${a.title}</span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${a.subject} ${a.description ? '• ' + a.description : ''}</p>
            </td>
            <td class="py-4 px-4 whitespace-nowrap text-xs">
              <span class="${dueBadgeClass}">${formatDate(a.dueDate)}</span>
              ${dueNotice}
            </td>
            <td class="py-4 px-4 whitespace-nowrap">${priorityBadge}</td>
            <td class="py-4 px-4 whitespace-nowrap">${statusBadge}</td>
            <td class="py-4 px-4 text-right whitespace-nowrap">
              <div class="flex items-center justify-end gap-1.5">
                <button onclick="editAssignment('${a.id}')" title="Edit Assignment" class="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition">
                  <i data-lucide="edit" class="w-4 h-4"></i>
                </button>
                <button onclick="deleteAssignment('${a.id}')" title="Delete Assignment" class="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // Populate Mobile Assignment Cards for Touch / Phones
  const mobileCardsContainer = document.getElementById('assignments-mobile-cards');
  if (mobileCardsContainer) {
    if (filtered.length === 0) {
      mobileCardsContainer.innerHTML = `
        <div class="py-10 px-4 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          No course assignments match the current filter criteria. Tap "+ Add Assignment" to record coursework.
        </div>
      `;
    } else {
      mobileCardsContainer.innerHTML = filtered.map(a => {
        const isCompleted = a.status === 'Completed';
        const isProgress = a.status === 'In Progress';

        const dueObj = new Date(a.dueDate);
        const todayObj = new Date();
        todayObj.setHours(0,0,0,0);
        dueObj.setHours(0,0,0,0);
        const diffDays = Math.round((dueObj - todayObj) / (1000 * 60 * 60 * 24));

        let dueBadgeClass = 'text-slate-500 dark:text-slate-400';
        let dueNotice = '';
        if (!isCompleted) {
          if (diffDays < 0) {
            dueBadgeClass = 'text-rose-600 dark:text-rose-400 font-bold';
            dueNotice = '<span class="px-1.5 py-0.2 rounded text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold">Overdue</span>';
          } else if (diffDays === 0) {
            dueBadgeClass = 'text-rose-600 dark:text-rose-400 font-bold';
            dueNotice = '<span class="px-1.5 py-0.2 rounded text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold">Due Today</span>';
          } else if (diffDays <= 3) {
            dueBadgeClass = 'text-amber-600 dark:text-amber-400 font-bold';
            dueNotice = `<span class="px-1.5 py-0.2 rounded text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">${diffDays}d left</span>`;
          }
        }

        const priorityBadge = a.priority === 'High'
          ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">🔥 High</span>`
          : (a.priority === 'Low'
              ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">🌱 Low</span>`
              : `<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">⚡ Medium</span>`);

        const statusBadge = isCompleted
          ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Completed</span>`
          : (isProgress
              ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">In Progress</span>`
              : `<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Pending</span>`);

        return `
          <div class="asgn-mobile-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs relative">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-3 flex-1 min-w-0">
                <input type="checkbox" ${isCompleted ? 'checked' : ''} onchange="toggleAssignmentStatus('${a.id}')" class="w-5 h-5 mt-0.5 text-indigo-600 rounded-lg cursor-pointer flex-shrink-0" />
                <div class="min-w-0 flex-1">
                  <h4 class="font-bold text-sm text-slate-900 dark:text-slate-100 ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''}">${a.title}</h4>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${a.subject} ${a.description ? '• ' + a.description : ''}</p>
                  <div class="flex items-center gap-1.5 mt-2 flex-wrap text-xs">
                    <span class="inline-flex items-center gap-1 text-[11px] font-semibold ${dueBadgeClass}">
                      <i data-lucide="clock" class="w-3.5 h-3.5"></i> ${formatDate(a.dueDate)}
                    </span>
                    ${dueNotice}
                    ${priorityBadge}
                    ${statusBadge}
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-1 flex-shrink-0">
                <button onclick="editAssignment('${a.id}')" title="Edit" class="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">
                  <i data-lucide="edit" class="w-4 h-4"></i>
                </button>
                <button onclick="deleteAssignment('${a.id}')" title="Delete" class="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Update profile quick stats
  updateProfileAssignmentStats(list);

  // --- SUBTAB 2: EXAMS & SYLLABUS ---
  const exams = getExams();
  const examsContainer = document.getElementById('exams-cards-container');
  if (examsContainer) {
    if (exams.length === 0) {
      examsContainer.innerHTML = `
        <div class="col-span-2 text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <i data-lucide="award" class="w-10 h-10 text-slate-400 mx-auto mb-2"></i>
          <p class="text-xs text-slate-400">No semester examination schedules published yet.</p>
        </div>
      `;
    } else {
      examsContainer.innerHTML = exams.map(ex => {
        const diffDays = Math.ceil((new Date(ex.examDate) - new Date()) / (1000 * 60 * 60 * 24));
        const countdownStr = diffDays > 0 ? `In ${diffDays} days` : (diffDays === 0 ? 'Today' : 'Concluded');
        return `
          <div class="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-500/40 transition space-y-3.5">
            <div class="flex items-start justify-between gap-3">
              <div>
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  ${ex.subject}
                </span>
                <h4 class="font-bold text-base text-slate-900 dark:text-white mt-1.5">${ex.title}</h4>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center gap-1 flex-shrink-0">
                <i data-lucide="clock" class="w-3.5 h-3.5"></i> ${countdownStr}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs pt-1">
              <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span class="text-[10px] text-slate-400 uppercase font-semibold block">Date & Timing</span>
                <span class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                  <i data-lucide="calendar" class="w-3.5 h-3.5 text-purple-500"></i> ${formatDate(ex.examDate)} (${ex.examTime || '10 AM - 1 PM'})
                </span>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span class="text-[10px] text-slate-400 uppercase font-semibold block">Venue / Room</span>
                <span class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                  <i data-lucide="map-pin" class="w-3.5 h-3.5 text-rose-500"></i> ${ex.room || 'Room 203'}
                </span>
              </div>
            </div>

            <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
              <span class="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <i data-lucide="book-open" class="w-3 h-3 text-indigo-500"></i> Syllabus Coverage
              </span>
              <p class="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">${ex.syllabus || 'Review official course units 1 to 4 on resource hub.'}</p>
            </div>

            ${isAdmin ? `
              <div class="flex justify-end pt-1">
                <button onclick="deleteExam('${ex.id}')" class="text-xs text-rose-500 hover:underline font-semibold flex items-center gap-1">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Remove Exam (Admin)
                </button>
              </div>
            ` : ''}
          </div>
        `;
      }).join('');
    }
  }

  lucide.createIcons();
}

function renderAssignmentsView() {
  renderPlannerView();
}

function toggleAssignmentStatus(id) {
  const userRoll = currentUser?.roll ? currentUser.roll.trim().toUpperCase() : 'GUEST';
  let assignments = getGlobalAssignments();
  const item = assignments.find(g => g.id === id);

  if (item) {
    if (!item.completedBy) item.completedBy = [];
    const isAlreadyCompleted = item.completedBy.some(r => String(r).trim().toUpperCase() === userRoll) || item.status === 'Completed';
    if (isAlreadyCompleted) {
      item.completedBy = item.completedBy.filter(r => String(r).trim().toUpperCase() !== userRoll);
      item.status = 'Pending';
      showToast('Assignment status updated: Pending', 'info');
    } else {
      if (!item.completedBy.some(r => String(r).trim().toUpperCase() === userRoll)) {
        item.completedBy.push(userRoll);
      }
      item.status = 'Completed';
      showToast('Assignment marked as Completed!', 'success');
    }
    setGlobalAssignments(assignments);
    if (isBackendConnected) {
      apiCall(`/assignments/${id}/toggle-completion`, 'POST', { roll: userRoll });
    }
  }

  renderPlannerView();
  renderHomeView();
}

function openAddAssignmentModal(editId = null) {
  const modal = document.getElementById('modal-add-assignment');
  const heading = document.getElementById('modal-asgn-heading');
  const idInput = document.getElementById('asgn-edit-id');

  if (editId) {
    const assignments = getGlobalAssignments();
    const item = assignments.find(a => a.id === editId);
    if (item) {
      if (idInput) idInput.value = item.id;
      if (heading) heading.textContent = 'Edit Course Assignment';
      document.getElementById('asgn-subject').value = item.subject || '';
      document.getElementById('asgn-title').value = item.title || '';
      document.getElementById('asgn-due').value = item.dueDate || '';
      document.getElementById('asgn-priority').value = item.priority || 'Medium';
      document.getElementById('asgn-status').value = item.status || 'Pending';
      document.getElementById('asgn-faculty').value = item.faculty || (item.createdBy || '');
      document.getElementById('asgn-desc').value = item.description || '';
    }
  } else {
    if (idInput) idInput.value = '';
    if (heading) heading.textContent = 'Add Course Assignment';
    document.getElementById('asgn-subject').value = 'Slot A (Mathematics)';
    document.getElementById('asgn-title').value = '';
    document.getElementById('asgn-due').value = '';
    document.getElementById('asgn-priority').value = 'Medium';
    document.getElementById('asgn-status').value = 'Pending';
    document.getElementById('asgn-faculty').value = currentUser?.role === 'admin' ? `Admin (${currentUser.name})` : (currentUser?.name || 'Self');
    document.getElementById('asgn-desc').value = '';
  }

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function editAssignment(id) {
  openAddAssignmentModal(id);
}

async function submitNewAssignment(event) {
  event.preventDefault();
  const editId = document.getElementById('asgn-edit-id')?.value;
  const subject = document.getElementById('asgn-subject').value.trim();
  const title = document.getElementById('asgn-title').value.trim();
  const due = document.getElementById('asgn-due').value;
  const priority = document.getElementById('asgn-priority').value;
  const status = document.getElementById('asgn-status').value;
  const faculty = document.getElementById('asgn-faculty')?.value.trim() || 'Self';
  const desc = document.getElementById('asgn-desc')?.value.trim() || '';

  let assignments = getGlobalAssignments();

  if (editId) {
    const idx = assignments.findIndex(a => a.id === editId);
    if (idx !== -1) {
      assignments[idx] = {
        ...assignments[idx],
        subject, title, dueDate: due, priority, status, description: desc, faculty
      };
      setGlobalAssignments(assignments);
      if (isBackendConnected) {
        await apiCall(`/assignments/${editId}`, 'PUT', {
          subject, title, dueDate: due, priority, status, description: desc
        });
      }
      showToast('Assignment updated successfully!', 'success');
    }
  } else {
    const newAssignment = {
      id: 'asgn_' + Date.now(),
      subject,
      title,
      dueDate: due,
      priority,
      status,
      description: desc,
      faculty,
      createdBy: faculty,
      isBroadcast: currentUser?.role === 'admin',
      completedBy: status === 'Completed' ? [currentUser?.roll || 'student'] : []
    };
    assignments.unshift(newAssignment);
    setGlobalAssignments(assignments);
    if (isBackendConnected) {
      await apiCall('/assignments', 'POST', {
        subject, title, dueDate: due, priority, status, description: desc, faculty, studentRoll: currentUser?.roll
      });
    }
    showToast('Assignment added to your planner!', 'success');
  }

  closeModal('modal-add-assignment');
  renderPlannerView();
  renderHomeView();
}

async function deleteAssignment(id) {
  if (!confirm('Are you sure you want to remove this assignment?')) return;
  let assignments = getGlobalAssignments();
  assignments = assignments.filter(a => a.id !== id);
  setGlobalAssignments(assignments);
  if (isBackendConnected) {
    await apiCall(`/assignments/${id}`, 'DELETE');
  }
  showToast('Assignment removed.', 'info');
  renderPlannerView();
  renderHomeView();
}

function openAddExamModal() {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only College Admin can schedule exams.', 'error');
    return;
  }
  const modal = document.getElementById('modal-add-exam');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

async function submitNewExam(event) {
  event.preventDefault();
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only College Admin can schedule exams.', 'error');
    return;
  }

  const subject = document.getElementById('exam-subject').value.trim();
  const title = document.getElementById('exam-title').value.trim();
  const examDate = document.getElementById('exam-date').value.trim();
  const room = document.getElementById('exam-room')?.value.trim() || 'Room 203';
  const examTime = document.getElementById('exam-time')?.value.trim() || '10:00 AM - 01:00 PM';
  const syllabus = document.getElementById('exam-syllabus')?.value.trim() || '';

  const exams = getExams();
  const newExam = {
    id: 'exam_' + Date.now(),
    subject,
    title,
    examDate,
    examTime,
    room,
    syllabus,
    createdBy: `Admin (${currentUser.name})`
  };

  exams.unshift(newExam);
  setExams(exams);
  if (isBackendConnected) {
    await apiCall('/exams', 'POST', {
      subject, title, examDate, examTime, room, syllabus
    });
  }

  closeModal('modal-add-exam');
  showToast(`Exam "${subject}" scheduled in Room 203!`, 'success');
  renderPlannerView();
  renderHomeView();
}

async function deleteExam(id) {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only College Admin can remove exams.', 'error');
    return;
  }
  if (!confirm('Are you sure you want to cancel this examination schedule?')) return;

  let exams = getExams();
  exams = exams.filter(e => e.id !== id);
  setExams(exams);
  if (isBackendConnected) {
    await apiCall(`/exams/${id}`, 'DELETE');
  }
  showToast('Exam schedule cancelled.', 'info');
  renderPlannerView();
  renderHomeView();
}

// --- E. CAMPUS EXCHANGE VIEW (BUY, SELL, LOST & FOUND) ---
let activeExchangeTab = 'sell';

function switchExchangeTab(type) {
  activeExchangeTab = type;
  ['sell', 'lost', 'found'].forEach(t => {
    const btn = document.getElementById(`exchange-tab-btn-${t}`);
    if (btn) {
      if (t === type) {
        btn.className = `px-4 py-1.5 text-xs font-bold rounded-lg transition bg-white dark:bg-slate-900 ${t === 'sell' ? 'text-emerald-600 dark:text-emerald-400' : (t === 'lost' ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400')} shadow-sm flex items-center gap-1.5`;
      } else {
        btn.className = "px-4 py-1.5 text-xs font-bold rounded-lg transition text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5";
      }
    }
  });

  renderExchangeView();
}

function filterExchangeListings() {
  renderExchangeView();
}

async function renderExchangeView() {
  let listings = getExchangeListings();
  const cat = document.getElementById('exchange-category-filter')?.value || 'all';
  const search = (document.getElementById('exchange-search-input')?.value || '').toLowerCase().trim();

  // If connected, sync fresh listings
  if (isBackendConnected) {
    try {
      const q = new URLSearchParams();
      if (activeExchangeTab) q.append('type', activeExchangeTab);
      if (cat !== 'all') q.append('category', cat);
      if (search) q.append('search', search);
      const res = await fetch(`${API_BASE}/exchange?${q.toString()}`);
      const data = await res.json();
      if (data?.success && Array.isArray(data.listings)) {
        listings = data.listings;
        if (data.counts) {
          const bSell = document.getElementById('exchange-badge-sell');
          const bLost = document.getElementById('exchange-badge-lost');
          const bFound = document.getElementById('exchange-badge-found');
          if (bSell) bSell.textContent = data.counts.sell || 0;
          if (bLost) bLost.textContent = data.counts.lost || 0;
          if (bFound) bFound.textContent = data.counts.found || 0;
        }
      }
    } catch (e) {
      console.warn('Exchange fetch notice:', e);
    }
  }

  // Filter in memory as well
  const filtered = listings.filter(item => {
    const matchesType = (item.type || 'sell') === activeExchangeTab;
    const matchesCat = (cat === 'all') || (item.category === cat);
    const matchesSearch = !search || 
      (item.title && item.title.toLowerCase().includes(search)) ||
      (item.description && item.description.toLowerCase().includes(search)) ||
      (item.location && item.location.toLowerCase().includes(search));
    return matchesType && matchesCat && matchesSearch;
  });

  const container = document.getElementById('exchange-listings-container');
  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
          <i data-lucide="inbox" class="w-7 h-7"></i>
        </div>
        <h4 class="font-bold text-base text-slate-800 dark:text-slate-200">No Listings Found</h4>
        <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">No campus items currently posted in this category. Be the first to publish a verified post.</p>
        <button onclick="openPostExchangeModal()" class="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow transition">
          + Post First Item
        </button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = filtered.map(item => {
    const isOwner = currentUser && (currentUser.id === item.userId || currentUser.roll === item.userRoll);
    const isAdmin = currentUser && currentUser.role === 'admin';
    const isSoldOrResolved = item.status === 'sold' || item.status === 'resolved';

    let typeBadge = '';
    if (item.type === 'sell') {
      typeBadge = `<span class="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500 text-white shadow-sm">₹${item.price || 'Free'}</span>`;
    } else if (item.type === 'lost') {
      typeBadge = `<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">LOST ITEM</span>`;
    } else {
      typeBadge = `<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500 text-white shadow-sm">FOUND ITEM</span>`;
    }

    const fallbackImg = item.type === 'lost'
      ? 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80'
      : (item.type === 'found'
          ? 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=500&auto=format&fit=crop&q=80');

    const displayImg = item.imageUrl || fallbackImg;

    return `
      <div class="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between">
        <div>
          <div class="h-44 relative bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <img src="${displayImg}" alt="${item.title}" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div class="absolute top-3 right-3">${typeBadge}</div>
            <span class="absolute bottom-3 left-3 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-black/70 text-white backdrop-blur-sm">
              ${item.category || 'General'}
            </span>
            ${isSoldOrResolved ? `
              <div class="absolute inset-0 bg-black/75 flex items-center justify-center backdrop-blur-[2px]">
                <span class="px-4 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-widest text-white bg-rose-600 shadow-lg">
                  ${item.type === 'sell' ? 'Item Sold' : 'Returned / Resolved'}
                </span>
              </div>
            ` : ''}
          </div>

          <div class="p-5 space-y-2.5">
            <div class="flex items-start justify-between gap-2">
              <h4 class="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">${item.title}</h4>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">${item.description}</p>
            
            <div class="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
              <span class="flex items-center gap-1"><i data-lucide="map-pin" class="w-3 h-3 text-rose-500"></i> ${item.location || 'Campus'}</span>
              <span>•</span>
              <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3"></i> ${item.date || 'Recent'}</span>
            </div>

            <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span class="text-slate-500 dark:text-slate-400">Owner:</span>
              <span class="font-semibold text-slate-700 dark:text-slate-200">${item.userName || 'Student'} (${item.userRoll || 'IIITNR'})</span>
            </div>
          </div>
        </div>

        <div class="p-5 pt-0 flex items-center justify-between gap-2">
          ${(isOwner || isAdmin) ? `
            <div class="flex items-center gap-2 w-full">
              ${!isSoldOrResolved ? `
                <button onclick="markExchangeStatus('${item.id}', '${item.type === 'sell' ? 'sold' : 'resolved'}')" class="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition">
                  ${item.type === 'sell' ? 'Mark as Sold' : 'Mark Returned'}
                </button>
              ` : ''}
              <button onclick="deleteExchangeListing('${item.id}')" title="Delete listing" class="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          ` : `
            <button onclick="openExchangeInquiry('${item.id}', '${item.title.replace(/'/g, "\\'")}')" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition shadow-sm flex items-center justify-center gap-1.5">
              <i data-lucide="message-square" class="w-3.5 h-3.5"></i>
              <span>${item.type === 'sell' ? 'Contact Seller' : (item.type === 'lost' ? 'I Found This Item' : 'Claim Belonging')}</span>
            </button>
          `}
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function openPostExchangeModal() {
  document.getElementById('ex-title').value = '';
  document.getElementById('ex-price').value = '';
  document.getElementById('ex-location').value = 'Room 203 / Academic Block';
  document.getElementById('ex-image').value = '';
  document.getElementById('ex-desc').value = '';
  document.getElementById('ex-category').value = 'Electronics';

  toggleExchangePriceField('sell');
  const modal = document.getElementById('modal-post-exchange');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function toggleExchangePriceField(type) {
  const wrapper = document.getElementById('ex-price-wrapper');
  if (wrapper) {
    if (type === 'sell') wrapper.classList.remove('hidden');
    else wrapper.classList.add('hidden');
  }
}

function handleExchangePhotoUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  compressImageToDataUrl(file, 600, 0.85, function(dataUrl) {
    document.getElementById('ex-image').value = dataUrl;
    showToast('Photo attached from gallery!', 'success');
  });
  event.target.value = '';
}

async function submitNewExchangeListing(event) {
  event.preventDefault();
  const typeRadio = document.querySelector('input[name="ex_type"]:checked');
  const type = typeRadio ? typeRadio.value : 'sell';
  const title = document.getElementById('ex-title').value.trim();
  const category = document.getElementById('ex-category').value;
  const price = document.getElementById('ex-price')?.value.trim() || '';
  const location = document.getElementById('ex-location').value.trim();
  const imageUrl = document.getElementById('ex-image').value.trim();
  const desc = document.getElementById('ex-desc').value.trim();

  const newPost = {
    id: 'ex_' + Date.now(),
    type,
    title,
    category,
    price: type === 'sell' ? price : '',
    location,
    imageUrl,
    description: desc,
    userId: currentUser?.id || 'student_001',
    userName: currentUser?.name || 'Campus Student',
    userRoll: currentUser?.roll || '24DSAI001',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: 'active'
  };

  const listings = getExchangeListings();
  listings.unshift(newPost);
  setExchangeListings(listings);

  if (isBackendConnected) {
    await apiCall('/exchange', 'POST', {
      type, title, category, price, location, imageUrl, description: desc,
      userId: currentUser?.id, userName: currentUser?.name, userRoll: currentUser?.roll
    });
  }

  closeModal('modal-post-exchange');
  showToast('Listing published successfully to Campus Exchange!', 'success');
  renderExchangeView();
}

function openExchangeInquiry(id, title) {
  const modal = document.getElementById('modal-exchange-inquiry');
  const idInput = document.getElementById('inquiry-listing-id');
  const titleEl = document.getElementById('inquiry-item-title');
  if (idInput) idInput.value = id;
  if (titleEl) titleEl.textContent = title;
  document.getElementById('inquiry-message').value = '';
  document.getElementById('inquiry-contact').value = currentUser ? `Roll: ${currentUser.roll} / Email: ${currentUser.email}` : '';
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

async function submitExchangeInquiry(event) {
  event.preventDefault();
  const id = document.getElementById('inquiry-listing-id').value;
  const message = document.getElementById('inquiry-message').value.trim();
  const contact = document.getElementById('inquiry-contact').value.trim();

  if (isBackendConnected) {
    await apiCall(`/exchange/${id}/inquiry`, 'POST', {
      senderRoll: currentUser?.roll || '24DSAI001',
      senderName: currentUser?.name || 'Student',
      message,
      contactInfo: contact
    });
  }

  closeModal('modal-exchange-inquiry');
  showToast('Inquiry sent to the listing owner! They will be notified.', 'success');
}

async function markExchangeStatus(id, status) {
  let listings = getExchangeListings();
  const item = listings.find(l => l.id === id);
  if (item) {
    item.status = status;
    setExchangeListings(listings);
  }
  if (isBackendConnected) {
    await apiCall(`/exchange/${id}/status`, 'PUT', { status, userRoll: currentUser?.roll });
  }
  showToast(`Listing marked as ${status}.`, 'info');
  renderExchangeView();
}

async function deleteExchangeListing(id) {
  if (!confirm('Are you sure you want to delete this listing?')) return;
  let listings = getExchangeListings();
  listings = listings.filter(l => l.id !== id);
  setExchangeListings(listings);
  if (isBackendConnected) {
    await apiCall(`/exchange/${id}?userRoll=${currentUser?.roll || ''}`, 'DELETE');
  }
  showToast('Listing removed from Campus Exchange.', 'info');
  renderExchangeView();
}

// --- F. HOSTEL MESS MENU VIEW ---
let currentMessDay = 'Monday';

function selectMessDay(day) {
  currentMessDay = day;
  renderMessView();
}

async function renderMessView() {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayDayName = dayNames[new Date().getDay()];
  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const isAdmin = currentUser && currentUser.role === 'admin';

  // Toggle admin edit button
  const adminMessBtn = document.getElementById('admin-edit-mess-btn');
  if (adminMessBtn) {
    if (isAdmin) {
      adminMessBtn.classList.remove('hidden');
      adminMessBtn.classList.add('flex');
    } else {
      adminMessBtn.classList.add('hidden');
      adminMessBtn.classList.remove('flex');
    }
  }

  let menu = getMessMenu();
  if (isBackendConnected) {
    try {
      const res = await fetch(`${API_BASE}/mess`);
      const data = await res.json();
      if (data?.success && Array.isArray(data.menu)) {
        menu = data.menu;
        setMessMenu(menu);
      }
    } catch (e) {}
  }

  // Render Day of the Week Pills
  const pillsContainer = document.getElementById('mess-day-pills-container');
  if (pillsContainer) {
    pillsContainer.innerHTML = daysOrder.map(d => {
      const isSelected = d === currentMessDay;
      const isToday = d === todayDayName;
      return `
        <button onclick="selectMessDay('${d}')" class="px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap shadow-sm ${
          isSelected 
            ? 'bg-amber-500 text-white shadow-amber-500/20' 
            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
        }">
          <span>${d}</span>
          ${isToday ? `<span class="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${isSelected ? 'bg-white text-amber-600' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'}">TODAY</span>` : ''}
        </button>
      `;
    }).join('');
  }

  // Render Active Day Card
  const activeDayCard = document.getElementById('mess-active-day-card');
  const activeDayData = menu.find(m => (m.day || m.day_of_week) === currentMessDay) || menu[0];

  if (activeDayCard && activeDayData) {
    activeDayCard.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Hostel Dining Schedule</span>
          <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            ${activeDayData.day || activeDayData.day_of_week}
            ${(activeDayData.day || activeDayData.day_of_week) === todayDayName ? `<span class="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">Today</span>` : ''}
          </h3>
        </div>
        ${isAdmin ? `
          <button onclick="openEditMessModal()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 self-start sm:self-auto shadow-sm">
            <i data-lucide="edit" class="w-3.5 h-3.5"></i> Edit ${activeDayData.day || activeDayData.day_of_week} Menu
          </button>
        ` : ''}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Breakfast -->
        <div class="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
          <div class="flex items-center justify-between">
            <span class="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
              <i data-lucide="coffee" class="w-3.5 h-3.5"></i> Breakfast
            </span>
            <span class="text-xs font-semibold text-slate-400">8:00 AM - 9:30 AM</span>
          </div>
          <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed pt-1">${activeDayData.breakfast}</p>
        </div>

        <!-- Lunch -->
        <div class="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-2">
          <div class="flex items-center justify-between">
            <span class="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
              <i data-lucide="utensils" class="w-3.5 h-3.5"></i> Lunch
            </span>
            <span class="text-xs font-semibold text-slate-400">12:30 PM - 2:00 PM</span>
          </div>
          <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed pt-1">${activeDayData.lunch}</p>
        </div>

        <!-- Evening Snacks -->
        <div class="p-5 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40 space-y-2">
          <div class="flex items-center justify-between">
            <span class="px-3 py-1 rounded-full text-xs font-extrabold bg-orange-500/20 text-orange-700 dark:text-orange-300 flex items-center gap-1.5">
              <i data-lucide="cookie" class="w-3.5 h-3.5"></i> Evening Snacks
            </span>
            <span class="text-xs font-semibold text-slate-400">5:00 PM - 6:00 PM</span>
          </div>
          <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed pt-1">${activeDayData.snacks}</p>
        </div>

        <!-- Dinner -->
        <div class="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 space-y-2">
          <div class="flex items-center justify-between">
            <span class="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
              <i data-lucide="moon" class="w-3.5 h-3.5"></i> Dinner
            </span>
            <span class="text-xs font-semibold text-slate-400">8:00 PM - 9:45 PM</span>
          </div>
          <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed pt-1">${activeDayData.dinner}</p>
        </div>
      </div>

      ${activeDayData.note ? `
        <div class="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-2.5">
          <i data-lucide="sparkles" class="w-4 h-4 flex-shrink-0"></i>
          <span><strong>Committee Note:</strong> ${activeDayData.note}</span>
        </div>
      ` : ''}
    `;
  }

  // Render Student Feedback & Reviews
  let feedbackList = DEFAULT_MESS_FEEDBACK;
  if (isBackendConnected) {
    try {
      const fbRes = await fetch(`${API_BASE}/mess/feedback`);
      const fbData = await fbRes.json();
      if (fbData?.success && Array.isArray(fbData.reviews)) {
        feedbackList = fbData.reviews;
        const avgEl = document.getElementById('mess-avg-rating-badge');
        if (avgEl && fbData.avgRating) {
          avgEl.innerHTML = `<i data-lucide="star" class="w-3 h-3 fill-amber-500 text-amber-500"></i> ${fbData.avgRating} / 5.0`;
        }
      }
    } catch (e) {}
  }

  const fbContainer = document.getElementById('mess-feedback-list-container');
  if (fbContainer) {
    fbContainer.innerHTML = feedbackList.map(r => `
      <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="font-bold text-xs text-slate-900 dark:text-white">${r.studentName || 'Student'}</span>
            <span class="text-[10px] text-slate-400">(${r.studentRoll || 'IIITNR'})</span>
          </div>
          <div class="flex items-center text-amber-400 text-xs">
            ${'★'.repeat(Number(r.rating) || 5)}
          </div>
        </div>
        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${r.comment || 'Good quality meals provided.'}</p>
        <div class="flex items-center justify-between text-[10px] text-slate-400 pt-1">
          <span class="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300">${r.mealType || 'Meal'}</span>
          <span>${r.time || 'Recent'}</span>
        </div>
      </div>
    `).join('');
  }

  lucide.createIcons();
}

function openEditMessModal() {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only College Admin can edit hostel dining schedule.', 'error');
    return;
  }
  const daySelect = document.getElementById('mess-edit-day');
  if (daySelect) daySelect.value = currentMessDay;
  loadMessDayDetails(currentMessDay);

  const modal = document.getElementById('modal-edit-mess');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function loadMessDayDetails(dayName) {
  const menu = getMessMenu();
  const dayData = menu.find(m => (m.day || m.day_of_week) === dayName);
  if (dayData) {
    document.getElementById('mess-edit-breakfast').value = dayData.breakfast || '';
    document.getElementById('mess-edit-lunch').value = dayData.lunch || '';
    document.getElementById('mess-edit-snacks').value = dayData.snacks || '';
    document.getElementById('mess-edit-dinner').value = dayData.dinner || '';
    document.getElementById('mess-edit-note').value = dayData.note || '';
  }
}

async function submitEditMessMenu(event) {
  event.preventDefault();
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only College Admin can edit hostel dining schedule.', 'error');
    return;
  }

  const day = document.getElementById('mess-edit-day').value;
  const breakfast = document.getElementById('mess-edit-breakfast').value.trim();
  const lunch = document.getElementById('mess-edit-lunch').value.trim();
  const snacks = document.getElementById('mess-edit-snacks').value.trim();
  const dinner = document.getElementById('mess-edit-dinner').value.trim();
  const note = document.getElementById('mess-edit-note').value.trim();

  let menu = getMessMenu();
  const idx = menu.findIndex(m => (m.day || m.day_of_week) === day);
  if (idx !== -1) {
    menu[idx] = { ...menu[idx], day, breakfast, lunch, snacks, dinner, note };
    setMessMenu(menu);
  }

  if (isBackendConnected) {
    await apiCall(`/mess/${day}`, 'PUT', { breakfast, lunch, snacks, dinner, note });
  }

  closeModal('modal-edit-mess');
  showToast(`Mess schedule for ${day} updated successfully!`, 'success');
  renderMessView();
  renderHomeView();
}

function openMessFeedbackModal() {
  const modal = document.getElementById('modal-mess-feedback');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
  setFeedbackRating(5);
}

function setFeedbackRating(stars) {
  document.getElementById('feedback-rating-val').value = stars;
  const label = document.getElementById('feedback-rating-label');
  const labels = { 1: '1.0 (Needs Improvement)', 2: '2.0 (Fair)', 3: '3.0 (Average)', 4: '4.0 (Good)', 5: '5.0 (Excellent)' };
  if (label) label.textContent = labels[stars] || `${stars}.0`;

  for (let i = 1; i <= 5; i++) {
    const starBtn = document.getElementById(`star-${i}`);
    if (starBtn) {
      if (i <= stars) {
        starBtn.className = "text-amber-400 hover:scale-125 transition";
      } else {
        starBtn.className = "text-slate-300 dark:text-slate-600 hover:scale-125 transition";
      }
    }
  }
}

async function submitMessFeedback(event) {
  event.preventDefault();
  const mealType = document.getElementById('feedback-meal-type').value;
  const rating = Number(document.getElementById('feedback-rating-val').value) || 5;
  const comment = document.getElementById('feedback-comment').value.trim();

  if (isBackendConnected) {
    await apiCall('/mess/feedback', 'POST', {
      studentRoll: currentUser?.roll || '24DSAI001',
      studentName: currentUser?.name || 'Campus Student',
      mealType,
      rating,
      comment
    });
  }

  closeModal('modal-mess-feedback');
  showToast('Thank you! Your meal rating was recorded for the mess committee.', 'success');
  renderMessView();
}

function updateProfileAssignmentStats(assignments) {
  const total = assignments.length;
  const completed = assignments.filter(a => a.status === 'Completed').length;
  const pending = total - completed;

  const totalEl = document.getElementById('stat-total-assign');
  const compEl = document.getElementById('stat-completed-assign');
  const pendEl = document.getElementById('stat-pending-assign');

  if (totalEl) totalEl.textContent = total;
  if (compEl) compEl.textContent = completed;
  if (pendEl) pendEl.textContent = pending;
}

// --- E. ANNOUNCEMENTS VIEW (Mockup 5) ---
// Requirement 4: Important announcements officially announced by admin
function renderAnnouncementsView() {
  const announcements = getAnnouncements();
  const container = document.getElementById('announcements-list-container');
  if (!container) return;

  const getNoticeCategoryBadge = (cat) => {
    switch (cat) {
      case 'Exams': return 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300';
      case 'Events': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
      case 'Academic': return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
      default: return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300';
    }
  };

  const getNoticeIcon = (cat) => {
    switch (cat) {
      case 'Exams': return 'calendar-check';
      case 'Events': return 'sparkles';
      case 'Academic': return 'graduation-cap';
      default: return 'book-open';
    }
  };

  container.innerHTML = announcements.map(ann => `
    <div class="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
      <div class="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 shadow-sm">
        <i data-lucide="${getNoticeIcon(ann.category)}" class="w-5 h-5"></i>
      </div>
      <div class="flex-1">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-slate-900 dark:text-white text-base">${ann.title}</h3>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${getNoticeCategoryBadge(ann.category)}">${ann.category}</span>
          </div>
          <span class="text-xs text-slate-400 font-medium">${ann.date}</span>
        </div>
        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${ann.body}</p>
        <div class="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span class="flex items-center gap-1.5"><i data-lucide="check-check" class="w-3.5 h-3.5 text-blue-500"></i> Official Notice by <strong>${ann.author || 'College Admin'}</strong></span>
          ${currentUser && currentUser.role === 'admin' ? `
            <button onclick="deleteAnnouncement('${ann.id}')" class="text-xs text-red-500 hover:underline">Delete Notice</button>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

function openAddAnnouncementModal() {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only Admin can post announcements.', 'error');
    return;
  }
  document.getElementById('ann-date').value = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  document.getElementById('modal-add-announcement').classList.remove('hidden');
  document.getElementById('modal-add-announcement').classList.add('flex');
}

function submitNewAnnouncement(event) {
  event.preventDefault();
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only Admin can post notices.', 'error');
    return;
  }

  const title = document.getElementById('ann-title').value.trim();
  const category = document.getElementById('ann-category').value;
  const date = document.getElementById('ann-date').value.trim();
  const desc = document.getElementById('ann-desc').value.trim();

  const announcements = getAnnouncements();
  const newAnn = {
    id: 'ann_' + Date.now(),
    title: title,
    body: desc,
    date: date,
    category: category,
    urgent: category === 'Exams',
    author: currentUser.name
  };

  announcements.unshift(newAnn);
  setAnnouncements(announcements);
  apiCall('/announcements', 'POST', {
    title, body: desc, category, date, urgent: category === 'Exams', author: currentUser.name
  });
  closeModal('modal-add-announcement');
  showToast('Official announcement published to all campus portals!', 'success');
  renderAnnouncementsView();
  renderHomeView();
}

function deleteAnnouncement(id) {
  if (!currentUser || currentUser.role !== 'admin') return;
  let announcements = getAnnouncements();
  announcements = announcements.filter(a => a.id !== id);
  setAnnouncements(announcements);
  apiCall(`/announcements/${id}`, 'DELETE');
  showToast('Announcement removed.', 'info');
  renderAnnouncementsView();
  renderHomeView();
}

// --- F. EVENTS CONTROLLER (ADMIN CAN ADD & MANAGE EVENTS) ---

const EVENT_THEME_PRESETS = {
  hackathon: {
    banner: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80',
    badgeColor: 'bg-indigo-600'
  },
  sports: {
    banner: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80',
    badgeColor: 'bg-emerald-600'
  },
  cultural: {
    banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    badgeColor: 'bg-rose-600'
  },
  workshop: {
    banner: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80',
    badgeColor: 'bg-amber-600'
  },
  seminar: {
    banner: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80',
    badgeColor: 'bg-blue-600'
  }
};

let tempEventBanner = null;

function renderEventsView() {
  const events = getEvents();
  const container = document.getElementById('events-full-list');
  if (!container) return;

  const isAdmin = currentUser && currentUser.role === 'admin';

  if (events.length === 0) {
    container.innerHTML = `
      <div class="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
          <i data-lucide="calendar-x" class="w-7 h-7"></i>
        </div>
        <h4 class="font-bold text-base text-slate-800 dark:text-slate-200">No Events Scheduled</h4>
        <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">There are currently no upcoming campus events. College administration can publish new events anytime.</p>
        ${isAdmin ? `
          <button onclick="openAddEventModal()" class="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow transition">
            + Add First Event (Admin)
          </button>
        ` : ''}
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = events.map(ev => `
    <div class="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row hover-lift transition">
      <div class="md:w-64 h-48 md:h-auto relative overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800">
        <img src="${ev.banner}" alt="${ev.title}" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <span class="absolute bottom-3 left-3 text-xs font-bold text-white px-2.5 py-1 rounded-lg ${ev.badgeColor || 'bg-indigo-600'}">
          ${ev.category || ev.title.split(' ')[0]}
        </span>
      </div>
      <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">${ev.title}</h3>
            <span class="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg self-start sm:self-auto">
              <i data-lucide="calendar" class="w-3.5 h-3.5"></i> ${ev.date}
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-rose-500"></i> ${ev.venue}
          </p>
          <p class="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">${ev.desc}</p>
        </div>

        <div class="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div class="text-xs text-slate-400">
            ${ev.createdBy ? `<span class="text-[11px] text-slate-400">Published by: <strong class="text-slate-600 dark:text-slate-300">${ev.createdBy}</strong></span>` : ''}
          </div>
          <div class="flex items-center gap-2">
            ${isAdmin ? `
              <button onclick="deleteEvent('${ev.id}')" class="px-3.5 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs font-semibold transition flex items-center gap-1">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
              </button>
            ` : ''}
            <button onclick="toggleEventRegistration('${ev.id}')" class="px-5 py-2.5 rounded-xl text-xs font-semibold shadow transition ${ev.registered ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} flex items-center gap-1.5">
              ${ev.registered ? '<i data-lucide="check" class="w-3.5 h-3.5"></i> Registered' : 'Register Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

function openAddEventModal() {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only Admin can add campus events.', 'error');
    return;
  }

  document.getElementById('ev-title').value = '';
  document.getElementById('ev-date').value = '';
  document.getElementById('ev-venue').value = '';
  document.getElementById('ev-desc').value = '';
  document.getElementById('ev-category').value = 'Hackathon';
  
  tempEventBanner = EVENT_THEME_PRESETS.hackathon.banner;
  const bannerPreview = document.getElementById('ev-banner-preview');
  if (bannerPreview) bannerPreview.src = tempEventBanner;

  document.getElementById('modal-add-event').classList.remove('hidden');
  document.getElementById('modal-add-event').classList.add('flex');
}

function triggerEventBannerUpload() {
  const input = document.getElementById('ev-banner-file-input');
  if (input) input.click();
}

function handleEventBannerFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  compressBannerToDataUrl(file, 800, 450, 0.85, function(dataUrl) {
    tempEventBanner = dataUrl;
    const bannerPreview = document.getElementById('ev-banner-preview');
    if (bannerPreview) bannerPreview.src = dataUrl;
    showToast('Event banner uploaded from gallery!', 'info');
  });
  event.target.value = '';
}

function setEventBannerPreset(themeKey) {
  const preset = EVENT_THEME_PRESETS[themeKey];
  if (preset) {
    tempEventBanner = preset.banner;
    const bannerPreview = document.getElementById('ev-banner-preview');
    if (bannerPreview) bannerPreview.src = preset.banner;
    showToast(`Preset "${themeKey}" banner selected.`, 'info');
  }
}

function handleEventCategoryChange() {
  const cat = document.getElementById('ev-category').value.toLowerCase();
  if (cat.includes('hackathon')) setEventBannerPreset('hackathon');
  else if (cat.includes('sports')) setEventBannerPreset('sports');
  else if (cat.includes('cultural')) setEventBannerPreset('cultural');
  else if (cat.includes('workshop')) setEventBannerPreset('workshop');
  else if (cat.includes('seminar') || cat.includes('lecture')) setEventBannerPreset('seminar');
}

function submitNewEvent(event) {
  event.preventDefault();
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only Admin can add events.', 'error');
    return;
  }

  const title = document.getElementById('ev-title').value.trim();
  const date = document.getElementById('ev-date').value.trim();
  const category = document.getElementById('ev-category').value;
  const venue = document.getElementById('ev-venue').value.trim();
  const desc = document.getElementById('ev-desc').value.trim();

  let badgeColor = 'bg-indigo-600';
  const catLower = category.toLowerCase();
  if (catLower.includes('sports')) badgeColor = 'bg-emerald-600';
  else if (catLower.includes('cultural')) badgeColor = 'bg-rose-600';
  else if (catLower.includes('workshop')) badgeColor = 'bg-amber-600';
  else if (catLower.includes('seminar')) badgeColor = 'bg-blue-600';
  else if (catLower.includes('club')) badgeColor = 'bg-purple-600';

  const banner = tempEventBanner || EVENT_THEME_PRESETS.hackathon.banner;

  const events = getEvents();
  const newEvent = {
    id: 'ev_' + Date.now(),
    title: title,
    date: date,
    venue: venue,
    category: category,
    desc: desc,
    registered: false,
    badgeColor: badgeColor,
    banner: banner,
    createdBy: currentUser.name,
    createdAt: new Date().toISOString()
  };

  events.unshift(newEvent);
  setEvents(events);
  apiCall('/events', 'POST', {
    title, date, venue, category, desc, badgeColor, banner, author: currentUser.name
  });
  closeModal('modal-add-event');
  showToast(`Campus Event "${title}" published successfully!`, 'success');
  renderEventsView();
  renderHomeView();
}

function deleteEvent(id) {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only Admin can delete events.', 'error');
    return;
  }
  if (!confirm('Are you sure you want to delete this campus event?')) return;

  let events = getEvents();
  events = events.filter(e => e.id !== id);
  setEvents(events);
  apiCall(`/events/${id}`, 'DELETE');
  showToast('Event removed successfully.', 'info');
  renderEventsView();
  renderHomeView();
}

function toggleEventRegistration(id) {
  const events = getEvents();
  const ev = events.find(e => e.id === id);
  if (ev) {
    ev.registered = !ev.registered;
    setEvents(events);
    if (isBackendConnected) {
      const roll = currentUser?.roll ? currentUser.roll.trim().toUpperCase() : '24DSAI001';
      apiCall(`/events/${id}/toggle-register`, 'POST', { roll });
    }
    showToast(ev.registered ? `Successfully registered for ${ev.title}!` : `Cancelled registration for ${ev.title}.`, 'info');
    renderEventsView();
  }
}

// --- G. STUDENT PROFILE VIEW & GALLERY PHOTO CONTROLLER ---
// Requirement: Profile photo should be changed using photo in gallery instead of link

let tempEditAvatar = null;
let tempRegAvatar = null;

// Photo Gallery compression helpers
function compressImageToDataUrl(file, maxDim, quality, callback) {
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('Please select a valid image file from your gallery.', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const width = img.width;
      const height = img.height;
      
      // Center-crop to square for profile avatars
      const size = Math.min(width, height);
      const startX = (width - size) / 2;
      const startY = (height - size) / 2;
      
      canvas.width = maxDim;
      canvas.height = maxDim;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, startX, startY, size, size, 0, 0, maxDim, maxDim);
      
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      callback(compressedDataUrl);
    };
    img.onerror = function() {
      showToast('Could not decode the chosen image file.', 'error');
    };
    img.src = e.target.result;
  };
  reader.onerror = function() {
    showToast('Failed to read file from your device.', 'error');
  };
  reader.readAsDataURL(file);
}

function compressBannerToDataUrl(file, maxW, maxH, quality, callback) {
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('Please select a valid image file from your gallery.', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      if (width > maxW) {
        height = Math.round((height * maxW) / width);
        width = maxW;
      }
      if (height > maxH) {
        width = Math.round((width * maxH) / height);
        height = maxH;
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      callback(compressedDataUrl);
    };
    img.onerror = function() {
      showToast('Could not load the chosen banner image.', 'error');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// 1. Direct avatar change from Profile Page card
function triggerProfileAvatarUpload() {
  const input = document.getElementById('profile-avatar-file-input');
  if (input) input.click();
}

function handleProfileAvatarFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  compressImageToDataUrl(file, 400, 0.85, function(dataUrl) {
    saveNewAvatar(dataUrl);
    showToast('Profile photo updated successfully from gallery!', 'success');
  });
  event.target.value = '';
}

async function saveNewAvatar(dataUrl) {
  if (!currentUser) return;
  currentUser.avatar = dataUrl;
  localStorage.setItem('iiitnr_active_session', JSON.stringify(currentUser));
  
  if (currentUser.role === 'student') {
    const students = getStudents();
    const idx = students.findIndex(s => s.id === currentUser.id);
    if (idx !== -1) {
      students[idx].avatar = dataUrl;
      setStudents(students);
    }
  }
  
  // Update all avatar nodes immediately across UI
  const profileAvatar = document.getElementById('profile-detail-avatar');
  if (profileAvatar) profileAvatar.src = dataUrl;
  const topAvatar = document.getElementById('top-user-avatar');
  if (topAvatar) topAvatar.src = dataUrl;
  const sidebarAvatar = document.getElementById('sidebar-user-avatar');
  if (sidebarAvatar) sidebarAvatar.src = dataUrl;
  const editPreview = document.getElementById('edit-avatar-preview');
  if (editPreview) editPreview.src = dataUrl;

  // Persist to server disk & SQLite database
  if (isBackendConnected) {
    try {
      const uploadRes = await apiCall('/upload/avatar', 'POST', { dataUrl });
      const finalAvatar = uploadRes?.url || dataUrl;
      apiCall(`/profile/${currentUser.id}`, 'PUT', { avatar: finalAvatar });
    } catch (e) {
      apiCall(`/profile/${currentUser.id}`, 'PUT', { avatar: dataUrl });
    }
  }
}

// Alias for any existing call to promptChangeAvatar
function promptChangeAvatar() {
  triggerProfileAvatarUpload();
}

// 2. Avatar change inside Edit Profile Modal
function triggerEditAvatarUpload() {
  const input = document.getElementById('edit-avatar-file-input');
  if (input) input.click();
}

function handleEditAvatarFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  compressImageToDataUrl(file, 400, 0.85, function(dataUrl) {
    tempEditAvatar = dataUrl;
    const preview = document.getElementById('edit-avatar-preview');
    if (preview) preview.src = dataUrl;
    showToast('Photo selected from gallery! Click "Save Profile" to apply.', 'info');
  });
  event.target.value = '';
}

// 3. Avatar change in Registration Modal
function triggerRegAvatarUpload() {
  const input = document.getElementById('reg-avatar-file-input');
  if (input) input.click();
}

function handleRegAvatarFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  compressImageToDataUrl(file, 400, 0.85, function(dataUrl) {
    tempRegAvatar = dataUrl;
    const preview = document.getElementById('reg-avatar-preview');
    if (preview) preview.src = dataUrl;
    showToast('Custom photo selected from gallery!', 'info');
  });
  event.target.value = '';
}

function renderProfileView() {
  if (!currentUser) return;

  const isStudent = currentUser.role === 'student';
  const nameEl = document.getElementById('profile-detail-name');
  const rollEl = document.getElementById('profile-detail-roll');
  const branchEl = document.getElementById('profile-detail-branch');
  const yearEl = document.getElementById('profile-detail-year');
  const semEl = document.getElementById('profile-detail-semester');
  const cgpaEl = document.getElementById('profile-detail-cgpa');
  const emailEl = document.getElementById('profile-detail-email');
  const avatarEl = document.getElementById('profile-detail-avatar');
  const taglineEl = document.getElementById('profile-detail-tagline');
  const badgeRoleEl = document.getElementById('profile-badge-role');

  if (isStudent) {
    nameEl.textContent = currentUser.name;
    rollEl.textContent = currentUser.roll;
    branchEl.textContent = currentUser.branch;
    yearEl.textContent = currentUser.year;
    semEl.textContent = currentUser.semester;
    cgpaEl.textContent = currentUser.cgpa;
    emailEl.textContent = currentUser.email;
    avatarEl.src = currentUser.avatar;
    taglineEl.textContent = `B.Tech - ${currentUser.branch}`;
    badgeRoleEl.textContent = 'Active Student';
    badgeRoleEl.className = "px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
  } else {
    // Admin profile view
    nameEl.textContent = currentUser.name;
    rollEl.textContent = 'ADMIN-IIITNR';
    branchEl.textContent = currentUser.department;
    yearEl.textContent = 'Academic Cell';
    semEl.textContent = 'Administration';
    cgpaEl.textContent = 'N/A';
    emailEl.textContent = currentUser.email;
    avatarEl.src = currentUser.avatar;
    taglineEl.textContent = currentUser.designation;
    badgeRoleEl.textContent = 'System Administrator';
    badgeRoleEl.className = "px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300";
  }

  // Display login timestamp and active session status
  const loginTimeEl = document.getElementById('profile-detail-logintime');
  const sessionTimeEl = document.getElementById('profile-session-time');
  let sessionDisplay = currentUser.loginTime;
  if (!sessionDisplay && (currentUser.session_login_time || currentUser.last_login)) {
    const rawTime = currentUser.session_login_time || currentUser.last_login;
    const d = new Date(rawTime);
    sessionDisplay = !isNaN(d.getTime()) 
      ? d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
      : rawTime;
  }
  if (!sessionDisplay) {
    sessionDisplay = 'Active Session';
  }
  if (loginTimeEl) {
    loginTimeEl.textContent = sessionDisplay;
  }
  if (sessionTimeEl) {
    sessionTimeEl.innerHTML = `<i data-lucide="clock" class="w-3.5 h-3.5"></i><span>Session: ${sessionDisplay}</span>`;
  }

  const manageAdminsBtn = document.getElementById('profile-btn-manage-admins');
  if (manageAdminsBtn) {
    if (currentUser.role === 'admin') {
      manageAdminsBtn.classList.remove('hidden');
      manageAdminsBtn.classList.add('flex');
    } else {
      manageAdminsBtn.classList.add('hidden');
      manageAdminsBtn.classList.remove('flex');
    }
  }

  // Render Theme Selector Cards in Profile View
  renderThemePickerUI();

  lucide.createIcons();
}

function openEditProfileModal() {
  if (!currentUser) return;
  tempEditAvatar = currentUser.avatar;
  const preview = document.getElementById('edit-avatar-preview');
  if (preview) preview.src = currentUser.avatar;

  document.getElementById('edit-name').value = currentUser.name;
  document.getElementById('edit-roll').value = currentUser.roll || 'ADMIN';
  document.getElementById('edit-branch').value = currentUser.branch || 'Data Science & AI';
  document.getElementById('edit-year').value = currentUser.year || '1st Year';
  document.getElementById('edit-sem').value = currentUser.semester || 'Semester 1';
  document.getElementById('edit-cgpa').value = currentUser.cgpa || '8.0';
  document.getElementById('edit-email').value = currentUser.email;

  document.getElementById('modal-edit-profile').classList.remove('hidden');
  document.getElementById('modal-edit-profile').classList.add('flex');
}

function submitEditProfile(event) {
  event.preventDefault();
  if (!currentUser) return;

  currentUser.name = document.getElementById('edit-name').value.trim();
  currentUser.roll = document.getElementById('edit-roll').value.trim();
  currentUser.branch = document.getElementById('edit-branch').value;
  currentUser.year = document.getElementById('edit-year').value;
  currentUser.semester = document.getElementById('edit-sem').value.trim();
  currentUser.cgpa = document.getElementById('edit-cgpa').value.trim();
  currentUser.email = document.getElementById('edit-email').value.trim();

  if (tempEditAvatar) {
    currentUser.avatar = tempEditAvatar;
  }

  // Save session and update list
  localStorage.setItem('iiitnr_active_session', JSON.stringify(currentUser));
  if (currentUser.role === 'student') {
    const students = getStudents();
    const idx = students.findIndex(s => s.id === currentUser.id);
    if (idx !== -1) {
      students[idx] = currentUser;
      setStudents(students);
    }
  }

  apiCall(`/profile/${currentUser.id}`, 'PUT', {
    name: currentUser.name,
    roll: currentUser.roll,
    branch: currentUser.branch,
    year: currentUser.year,
    semester: currentUser.semester,
    cgpa: currentUser.cgpa,
    email: currentUser.email,
    avatar: currentUser.avatar
  });

  closeModal('modal-edit-profile');
  showToast('Profile information and photo updated successfully!', 'success');
  renderProfileView();
}


// ==========================================
// CHANGE PASSWORD HANDLERS
// ==========================================
function openChangePasswordModal() {
  if (!currentUser) return;
  const currPassInput = document.getElementById('change-curr-pass');
  const newPassInput = document.getElementById('change-new-pass');
  const confirmPassInput = document.getElementById('change-confirm-pass');
  if (currPassInput) currPassInput.value = '';
  if (newPassInput) newPassInput.value = '';
  if (confirmPassInput) confirmPassInput.value = '';

  const modal = document.getElementById('modal-change-password');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function togglePasswordVisibility(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (icon) icon.setAttribute('data-lucide', 'eye-off');
  } else {
    input.type = 'password';
    if (icon) icon.setAttribute('data-lucide', 'eye');
  }
  if (window.lucide) lucide.createIcons();
}

async function submitChangePassword(event) {
  event.preventDefault();
  if (!currentUser) {
    showToast('Please log in first.', 'error');
    return;
  }

  const currentPass = (document.getElementById('change-curr-pass')?.value || '').trim();
  const newPass = (document.getElementById('change-new-pass')?.value || '').trim();
  const confirmPass = (document.getElementById('change-confirm-pass')?.value || '').trim();

  if (!currentPass || !newPass || !confirmPass) {
    showToast('Please fill in all password fields.', 'error');
    return;
  }

  if (newPass.length < 6) {
    showToast('New password must be at least 6 characters long.', 'error');
    return;
  }

  if (newPass !== confirmPass) {
    showToast('New passwords do not match. Please verify.', 'error');
    return;
  }

  if (currentPass === newPass) {
    showToast('New password cannot be identical to current password.', 'error');
    return;
  }

  // Attempt backend update first
  let backendSuccess = false;
  if (isBackendConnected) {
    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
          'x-user-role': currentUser.role || 'student',
          'x-user-roll': currentUser.roll || ''
        },
        body: JSON.stringify({
          currentPassword: currentPass,
          newPassword: newPass,
          roll: currentUser.roll,
          email: currentUser.email,
          userId: currentUser.id
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || 'Incorrect current password or server rejection.', 'error');
        return;
      }
      backendSuccess = true;
    } catch (err) {
      console.warn('Backend change password error:', err);
    }
  }

  // Update locally in active session and student list
  currentUser.password = newPass;
  localStorage.setItem('iiitnr_active_session', JSON.stringify(currentUser));

  const students = getStudents();
  const idx = students.findIndex(s => 
    (s.id && currentUser.id && s.id === currentUser.id) ||
    (s.roll && currentUser.roll && s.roll.toUpperCase() === currentUser.roll.toUpperCase())
  );
  if (idx !== -1) {
    students[idx].password = newPass;
    setStudents(students);
  }

  closeModal('modal-change-password');
  showToast('Password updated successfully! Please keep your new password safe.', 'success');
}

// ==========================================
// 6. GLOBAL UTILITY FUNCTIONS
// ==========================================

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgColors = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    info: 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
  };

  toast.className = `${bgColors[type] || bgColors.info} px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 pointer-events-auto transform transition duration-300 translate-y-3 opacity-0`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('translate-y-3', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-3');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==========================================
// 6A. GLOBAL UNIFIED SEARCH CONTROLLER
// ==========================================

let searchDebounceTimer = null;

function handleGlobalSearch(query) {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);

  const q = (query || '').trim();
  const dropdown = document.getElementById('global-search-dropdown');
  const resultsContainer = document.getElementById('global-search-results');
  const notifDd = document.getElementById('notification-dropdown');
  if (notifDd) notifDd.classList.add('hidden');

  if (!dropdown || !resultsContainer) return;

  if (!q || q.length < 2) {
    dropdown.classList.add('hidden');
    resultsContainer.innerHTML = '';
    return;
  }

  dropdown.classList.remove('hidden');
  resultsContainer.innerHTML = `
    <div class="py-6 text-center text-slate-400 dark:text-slate-500">
      <div class="inline-block animate-spin w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full mb-2"></div>
      <p class="text-xs">Searching campus records for "${escapeHtml(q)}"...</p>
    </div>
  `;

  searchDebounceTimer = setTimeout(async () => {
    try {
      if (isBackendConnected) {
        const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}`).then(r => r.json());
        if (res && res.success) {
          renderGlobalSearchResults(res.results, res.total, q);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend search error, falling back to local storage:', err);
    }

    // Local fallback search across cached entities
    const term = q.toLowerCase();
    const localAssignments = getGlobalAssignments().filter(a =>
      (a.title && a.title.toLowerCase().includes(term)) ||
      (a.subject && a.subject.toLowerCase().includes(term)) ||
      (a.description && a.description.toLowerCase().includes(term))
    ).slice(0, 5).map(a => ({ ...a, itemType: 'assignment', targetView: 'planner' }));

    const localExams = getExams().filter(e =>
      (e.title && e.title.toLowerCase().includes(term)) ||
      (e.subject && e.subject.toLowerCase().includes(term)) ||
      (e.syllabus && e.syllabus.toLowerCase().includes(term))
    ).slice(0, 5).map(e => ({ ...e, itemType: 'exam', targetView: 'planner' }));

    const localResources = getResources().filter(r =>
      (r.title && r.title.toLowerCase().includes(term)) ||
      (r.subject && r.subject.toLowerCase().includes(term)) ||
      (r.description && r.description.toLowerCase().includes(term))
    ).slice(0, 5).map(r => ({ ...r, itemType: 'resource', targetView: 'resources' }));

    const localEvents = getEvents().filter(e =>
      (e.title && e.title.toLowerCase().includes(term)) ||
      (e.venue && e.venue.toLowerCase().includes(term)) ||
      (e.description && e.description.toLowerCase().includes(term))
    ).slice(0, 5).map(e => ({ ...e, itemType: 'event', targetView: 'events' }));

    const localAnnouncements = getAnnouncements().filter(a =>
      (a.title && a.title.toLowerCase().includes(term)) ||
      (a.body && a.body.toLowerCase().includes(term)) ||
      (a.category && a.category.toLowerCase().includes(term))
    ).slice(0, 5).map(a => ({ ...a, itemType: 'announcement', targetView: 'announcements' }));

    const localExchange = getExchangeListings().filter(l =>
      l.status === 'active' && (
        (l.title && l.title.toLowerCase().includes(term)) ||
        (l.description && l.description.toLowerCase().includes(term)) ||
        (l.category && l.category.toLowerCase().includes(term)) ||
        (l.location && l.location.toLowerCase().includes(term))
      )
    ).slice(0, 5).map(l => ({ ...l, itemType: 'exchange', targetView: 'exchange' }));

    const localResults = {
      assignments: localAssignments,
      exams: localExams,
      resources: localResources,
      events: localEvents,
      announcements: localAnnouncements,
      exchange: localExchange
    };
    const total = localAssignments.length + localExams.length + localResources.length +
                  localEvents.length + localAnnouncements.length + localExchange.length;

    renderGlobalSearchResults(localResults, total, q);
  }, 200);
}

function renderGlobalSearchResults(results, total, query) {
  const container = document.getElementById('global-search-results');
  if (!container) return;

  if (!results || total === 0) {
    container.innerHTML = `
      <div class="py-8 px-4 text-center text-slate-400 dark:text-slate-500">
        <i data-lucide="search-x" class="w-8 h-8 mx-auto mb-2 text-slate-400 dark:text-slate-600"></i>
        <p class="font-semibold text-slate-700 dark:text-slate-300">No campus records found for "${escapeHtml(query)}"</p>
        <p class="text-[11px] mt-1 text-slate-400">Try searching for subject names, course codes, exams, items, or announcements.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  let html = `<div class="p-1 space-y-3">`;

  // 1. Assignments
  if (results.assignments && results.assignments.length > 0) {
    html += `
      <div>
        <div class="flex items-center justify-between px-2 py-1 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-indigo-600 dark:text-indigo-400 font-bold text-[10px] uppercase tracking-wider mb-1.5">
          <span class="flex items-center gap-1.5"><i data-lucide="file-text" class="w-3.5 h-3.5"></i> Assignments (${results.assignments.length})</span>
          <span>Planner</span>
        </div>
        <div class="space-y-1">
          ${results.assignments.map(a => `
            <div onclick='selectSearchResult("planner", "assignment", ${JSON.stringify(a)})' 
                 class="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition flex items-center justify-between">
              <div class="min-w-0 pr-2">
                <p class="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">${escapeHtml(a.title)}</p>
                <p class="text-[10px] text-slate-400 dark:text-slate-500">${escapeHtml(a.subject || 'Assignment')}</p>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-semibold shrink-0">Due ${escapeHtml(a.dueDate || 'Soon')}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 2. Exams
  if (results.exams && results.exams.length > 0) {
    html += `
      <div>
        <div class="flex items-center justify-between px-2 py-1 bg-amber-50 dark:bg-amber-950/40 rounded-lg text-amber-600 dark:text-amber-400 font-bold text-[10px] uppercase tracking-wider mb-1.5">
          <span class="flex items-center gap-1.5"><i data-lucide="calendar" class="w-3.5 h-3.5"></i> Upcoming Exams (${results.exams.length})</span>
          <span>Room 203</span>
        </div>
        <div class="space-y-1">
          ${results.exams.map(e => `
            <div onclick='selectSearchResult("planner", "exam", ${JSON.stringify(e)})' 
                 class="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition flex items-center justify-between">
              <div class="min-w-0 pr-2">
                <p class="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">${escapeHtml(e.title)}</p>
                <p class="text-[10px] text-slate-400 dark:text-slate-500">${escapeHtml(e.subject || 'Exam')} • ${escapeHtml(e.room || 'Room 203')}</p>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-semibold shrink-0">${escapeHtml(e.examDate || 'Scheduled')}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 3. Resources
  if (results.resources && results.resources.length > 0) {
    html += `
      <div>
        <div class="flex items-center justify-between px-2 py-1 bg-sky-50 dark:bg-sky-950/40 rounded-lg text-sky-600 dark:text-sky-400 font-bold text-[10px] uppercase tracking-wider mb-1.5">
          <span class="flex items-center gap-1.5"><i data-lucide="book-open" class="w-3.5 h-3.5"></i> Study Resources (${results.resources.length})</span>
          <span>Academic Hub</span>
        </div>
        <div class="space-y-1">
          ${results.resources.map(r => `
            <div onclick='selectSearchResult("resources", "resource", ${JSON.stringify(r)})' 
                 class="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition flex items-center justify-between">
              <div class="min-w-0 pr-2">
                <p class="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">${escapeHtml(r.title)}</p>
                <p class="text-[10px] text-slate-400 dark:text-slate-500">${escapeHtml(r.subject || 'Resource')} • ${escapeHtml(r.semester || 'Sem 1')}</p>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-300 font-semibold shrink-0">${escapeHtml(r.type || 'Resource')}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 4. Events
  if (results.events && results.events.length > 0) {
    html += `
      <div>
        <div class="flex items-center justify-between px-2 py-1 bg-purple-50 dark:bg-purple-950/40 rounded-lg text-purple-600 dark:text-purple-400 font-bold text-[10px] uppercase tracking-wider mb-1.5">
          <span class="flex items-center gap-1.5"><i data-lucide="sparkles" class="w-3.5 h-3.5"></i> Campus Events (${results.events.length})</span>
          <span>Activities</span>
        </div>
        <div class="space-y-1">
          ${results.events.map(ev => `
            <div onclick='selectSearchResult("events", "event", ${JSON.stringify(ev)})' 
                 class="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition flex items-center justify-between">
              <div class="min-w-0 pr-2">
                <p class="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">${escapeHtml(ev.title)}</p>
                <p class="text-[10px] text-slate-400 dark:text-slate-500">${escapeHtml(ev.venue || 'Campus')} • ${escapeHtml(ev.category || 'Event')}</p>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 font-semibold shrink-0">${escapeHtml(ev.date || 'Upcoming')}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 5. Announcements
  if (results.announcements && results.announcements.length > 0) {
    html += `
      <div>
        <div class="flex items-center justify-between px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-wider mb-1.5">
          <span class="flex items-center gap-1.5"><i data-lucide="bell" class="w-3.5 h-3.5"></i> Circulars & Notices (${results.announcements.length})</span>
          <span>Official</span>
        </div>
        <div class="space-y-1">
          ${results.announcements.map(an => `
            <div onclick='selectSearchResult("announcements", "announcement", ${JSON.stringify(an)})' 
                 class="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition flex items-center justify-between">
              <div class="min-w-0 pr-2">
                <p class="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">${escapeHtml(an.title)}</p>
                <p class="text-[10px] text-slate-400 dark:text-slate-500">${escapeHtml(an.category || 'Circular')}</p>
              </div>
              <span class="text-[10px] text-slate-400 shrink-0">${escapeHtml(an.date || '')}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 6. Campus Exchange
  if (results.exchange && results.exchange.length > 0) {
    html += `
      <div>
        <div class="flex items-center justify-between px-2 py-1 bg-rose-50 dark:bg-rose-950/40 rounded-lg text-rose-600 dark:text-rose-400 font-bold text-[10px] uppercase tracking-wider mb-1.5">
          <span class="flex items-center gap-1.5"><i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i> Campus Exchange (${results.exchange.length})</span>
          <span>Buy, Sell & Lost-Found</span>
        </div>
        <div class="space-y-1">
          ${results.exchange.map(ex => {
            const badgeType = ex.type === 'lost' ? 'Lost' : (ex.type === 'found' ? 'Found' : (ex.price ? `₹${ex.price}` : 'For Sale'));
            const badgeColor = ex.type === 'lost' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' : (ex.type === 'found' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300');
            return `
              <div onclick='selectSearchResult("exchange", "exchange", ${JSON.stringify(ex)})' 
                   class="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition flex items-center justify-between">
                <div class="min-w-0 pr-2">
                  <p class="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">${escapeHtml(ex.title)}</p>
                  <p class="text-[10px] text-slate-400 dark:text-slate-500">${escapeHtml(ex.category || 'Exchange')} • ${escapeHtml(ex.location || 'Campus')}</p>
                </div>
                <span class="text-[10px] px-2 py-0.5 rounded-md ${badgeColor} font-bold shrink-0">${escapeHtml(badgeType)}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  html += `</div>`;
  container.innerHTML = html;
  lucide.createIcons();
}

function selectSearchResult(targetView, itemType, item) {
  closeGlobalSearch();

  if (targetView === 'planner') {
    navigateTo('planner');
    if (itemType === 'exam') {
      switchPlannerTab('exams');
    } else {
      switchPlannerTab('assignments');
    }
  } else if (targetView === 'exchange') {
    navigateTo('exchange');
    if (item && item.type) {
      switchExchangeTab(item.type);
    }
  } else if (targetView === 'resources') {
    navigateTo('resources');
    const input = document.getElementById('resource-search-input');
    if (input && item && (item.title || item.subject)) {
      input.value = item.title || item.subject;
      filterResources();
    }
  } else {
    navigateTo(targetView);
  }
}

function closeGlobalSearch() {
  const dd = document.getElementById('global-search-dropdown');
  if (dd) dd.classList.add('hidden');
  const input = document.getElementById('global-search');
  if (input) input.value = '';
}

// ==========================================
// 6B. CENTRALIZED NOTIFICATION CENTER
// ==========================================

async function fetchNotifications() {
  if (isBackendConnected) {
    try {
      const roll = currentUser?.roll || '24DSAI001';
      const res = await fetch(`${API_BASE}/notifications?roll=${encodeURIComponent(roll)}`).then(r => r.json());
      if (res && res.success && Array.isArray(res.notifications)) {
        setNotifications(res.notifications);
        updateNotificationBadgeUI(res.unreadCount ?? res.notifications.filter(n => !n.isRead).length);
        return;
      }
    } catch (e) {
      console.warn('Error fetching backend notifications:', e);
    }
  }

  // Fallback to local storage
  const localNotifs = getNotifications();
  const unreadCount = localNotifs.filter(n => !n.isRead || n.isRead === 0).length;
  updateNotificationBadgeUI(unreadCount);
}

function updateNotificationBadgeUI(unreadCount) {
  const badge = document.getElementById('notification-badge');
  const ddCount = document.getElementById('notification-dropdown-count');
  
  const count = typeof unreadCount === 'number' ? unreadCount : 0;
  
  if (badge) {
    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : count;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  if (ddCount) {
    ddCount.textContent = count > 0 ? `${count} new` : '0 new';
  }
}

function renderNotificationList() {
  const list = document.getElementById('quick-notifications-list');
  if (!list) return;

  const notifications = getNotifications();
  if (!notifications || notifications.length === 0) {
    list.innerHTML = `
      <div class="py-8 text-center text-slate-400 dark:text-slate-500">
        <i data-lucide="bell-off" class="w-8 h-8 mx-auto mb-2 opacity-50"></i>
        <p class="font-medium text-xs text-slate-700 dark:text-slate-300">No notifications right now</p>
        <p class="text-[10px] mt-0.5 text-slate-400">Campus alerts and updates will appear here</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  list.innerHTML = notifications.map(n => {
    const isUnread = !n.isRead || n.isRead === 0;
    let typeIcon = 'bell';
    let badgeColor = 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60';
    if (n.type === 'assignment') {
      typeIcon = 'file-text';
      badgeColor = 'text-blue-500 bg-blue-50 dark:bg-blue-950/60';
    } else if (n.type === 'exam') {
      typeIcon = 'calendar-clock';
      badgeColor = 'text-amber-500 bg-amber-50 dark:bg-amber-950/60';
    } else if (n.type === 'mess') {
      typeIcon = 'utensils';
      badgeColor = 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60';
    } else if (n.type === 'event') {
      typeIcon = 'sparkles';
      badgeColor = 'text-purple-500 bg-purple-50 dark:bg-purple-950/60';
    } else if (n.type === 'announcement') {
      typeIcon = 'megaphone';
      badgeColor = 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/60';
    } else if (n.type === 'exchange') {
      typeIcon = 'shopping-bag';
      badgeColor = 'text-rose-500 bg-rose-50 dark:bg-rose-950/60';
    }

    const timeDisplay = n.timeStr || (n.createdAt ? formatDate(n.createdAt) : 'Recent');

    return `
      <div class="group relative p-2.5 rounded-xl border transition cursor-pointer ${isUnread ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/60 shadow-sm' : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 opacity-80 hover:opacity-100'}"
           onclick="handleNotificationClick(${n.id}, '${escapeHtml(n.linkView || 'home')}')">
        <div class="flex items-start gap-2.5">
          <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${badgeColor}">
            <i data-lucide="${typeIcon}" class="w-3.5 h-3.5"></i>
          </div>
          <div class="flex-1 min-w-0 pr-4">
            <div class="flex items-center gap-1.5 mb-0.5">
              <p class="font-bold text-xs ${isUnread ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'} truncate">${escapeHtml(n.title)}</p>
              ${isUnread ? '<span class="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>' : ''}
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-1">${escapeHtml(n.message)}</p>
            <div class="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
              <span>${escapeHtml(timeDisplay)}</span>
              <span class="capitalize text-slate-400 font-medium">${escapeHtml(n.type || 'Alert')}</span>
            </div>
          </div>
          ${isUnread ? `
            <button onclick="markNotificationRead(${n.id}, event)" title="Mark as read" class="absolute top-2.5 right-2 p-1 rounded-md text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-100/60 dark:hover:bg-indigo-900/40 transition">
              <i data-lucide="check" class="w-3.5 h-3.5"></i>
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function toggleNotificationDropdown() {
  const dd = document.getElementById('notification-dropdown');
  const searchDd = document.getElementById('global-search-dropdown');
  if (searchDd) searchDd.classList.add('hidden');

  if (dd) {
    dd.classList.toggle('hidden');
    if (!dd.classList.contains('hidden')) {
      renderNotificationList();
    }
  }
}

async function markNotificationRead(id, event) {
  if (event) {
    event.stopPropagation();
  }
  
  let notifs = getNotifications();
  notifs = notifs.map(n => {
    if (n.id === id || String(n.id) === String(id)) {
      return { ...n, isRead: 1 };
    }
    return n;
  });
  setNotifications(notifs);
  
  const unreadCount = notifs.filter(n => !n.isRead || n.isRead === 0).length;
  updateNotificationBadgeUI(unreadCount);
  renderNotificationList();

  if (isBackendConnected) {
    try {
      await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PUT' });
    } catch (e) {
      console.warn('Backend mark notification read error:', e);
    }
  }
}

async function markAllNotificationsAsRead() {
  let notifs = getNotifications();
  if (notifs.length === 0) return;

  notifs = notifs.map(n => ({ ...n, isRead: 1 }));
  setNotifications(notifs);
  updateNotificationBadgeUI(0);
  renderNotificationList();
  showToast('All notifications marked as read.', 'info');

  if (isBackendConnected) {
    try {
      await fetch(`${API_BASE}/notifications/read-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roll: currentUser?.roll || '24DSAI001' })
      });
    } catch (e) {
      console.warn('Backend mark all read error:', e);
    }
  }
}

async function handleNotificationClick(id, linkView) {
  await markNotificationRead(id);
  const dd = document.getElementById('notification-dropdown');
  if (dd) dd.classList.add('hidden');

  let target = linkView || 'home';
  if (target === 'assignments') {
    navigateTo('planner');
    switchPlannerTab('assignments');
  } else if (target === 'exams') {
    navigateTo('planner');
    switchPlannerTab('exams');
  } else {
    navigateTo(target);
  }
}

// Global click and Escape listeners for floating menus
document.addEventListener('click', (e) => {
  const searchInput = document.getElementById('global-search');
  const searchDd = document.getElementById('global-search-dropdown');
  if (searchDd && !searchDd.classList.contains('hidden')) {
    if (searchInput && !searchInput.contains(e.target) && !searchDd.contains(e.target)) {
      searchDd.classList.add('hidden');
    }
  }

  const notifBtn = document.querySelector('[onclick*="toggleNotificationDropdown"]');
  const notifDd = document.getElementById('notification-dropdown');
  if (notifDd && !notifDd.classList.contains('hidden')) {
    if (notifBtn && !notifBtn.contains(e.target) && !notifDd.contains(e.target)) {
      notifDd.classList.add('hidden');
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const searchDd = document.getElementById('global-search-dropdown');
    if (searchDd) searchDd.classList.add('hidden');
    const notifDd = document.getElementById('notification-dropdown');
    if (notifDd) notifDd.classList.add('hidden');
  }
});

// ==========================================
// 7. DATABASE MANAGEMENT CONSOLE CONTROLLER
// ==========================================

let currentActiveDbTable = 'users';
let currentDbRows = [];

async function refreshLiveDatabase(showNotification = false) {
  const btn = document.getElementById('btn-refresh-live-db');
  if (btn) {
    const icon = btn.querySelector('i');
    if (icon) icon.classList.add('animate-spin');
  }

  try {
    await renderDatabaseView();
    await loadAdminModalData();
    if (showNotification) {
      showToast('Live SQLite database records and registrations synchronized!', 'success');
    }
  } catch (err) {
    console.warn('Error refreshing live database:', err);
  } finally {
    if (btn) {
      const icon = btn.querySelector('i');
      if (icon) icon.classList.remove('animate-spin');
    }
  }
}

async function renderDatabaseView() {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Access Denied: Database & SQL Console is strictly restricted to Administration.', 'error');
    navigateTo('timetable');
    return;
  }

  updateUserUIElements();
  lucide.createIcons();

  // 1. Fetch DB Stats
  if (isBackendConnected) {
    try {
      const statsRes = await apiCall('/database/stats');
      if (statsRes?.success) {
        const sizeEl = document.getElementById('db-file-size-label');
        if (sizeEl) sizeEl.textContent = `File Size: ~${statsRes.fileSizeKB || '96 KB'}`;

        const counts = statsRes.tableCounts || {};
        for (const [tName, count] of Object.entries(counts)) {
          const badge = document.getElementById(`pill-count-${tName}`);
          if (badge) badge.textContent = `(${count})`;
        }
      }
    } catch (e) {
      console.warn('DB stats fetch error:', e);
    }
  } else {
    // Standalone Client-Side fallback metrics
    let totalStorageBytes = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        totalStorageBytes += (key.length + (localStorage.getItem(key) || '').length) * 2;
      }
    } catch (e) {}
    const sizeKB = (totalStorageBytes / 1024).toFixed(1);

    const sizeEl = document.getElementById('db-file-size-label');
    if (sizeEl) sizeEl.textContent = `Client Storage: ~${sizeKB} KB`;

    const engineLabel = document.getElementById('db-engine-label');
    if (engineLabel) engineLabel.textContent = 'Client Storage Engine';

    const pathLabel = document.getElementById('db-storage-path-label');
    if (pathLabel) pathLabel.textContent = 'localStorage (Client)';

    const descLabel = document.getElementById('db-storage-desc-label');
    if (descLabel) descLabel.textContent = 'Persistent browser storage';

    const statusTextEl = document.getElementById('db-connection-status-text');
    if (statusTextEl) {
      statusTextEl.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4 text-emerald-500"></i> Standalone Active`;
    }

    const statusSubEl = document.getElementById('db-connection-status-sub');
    if (statusSubEl) statusSubEl.textContent = '100% Client-Side Engine';

    const students = getStudents();
    const resources = getResources();
    const timetableRows = getLocalTableRows('timetable');
    const assignments = getGlobalAssignments();
    const announcements = getAnnouncements();
    const events = getEvents();
    const completions = JSON.parse(localStorage.getItem('iiitnr_assignment_completions') || '[]');
    const eventRegs = JSON.parse(localStorage.getItem('iiitnr_event_registrations') || '[]');

    const uBadge = document.getElementById('pill-count-users');
    if (uBadge) uBadge.textContent = `(${students.length})`;
    const rBadge = document.getElementById('pill-count-resources');
    if (rBadge) rBadge.textContent = `(${resources.length})`;
    const tBadge = document.getElementById('pill-count-timetable');
    if (tBadge) tBadge.textContent = `(${timetableRows.length || 135})`;
    const aBadge = document.getElementById('pill-count-assignments');
    if (aBadge) aBadge.textContent = `(${assignments.length})`;
    const acBadge = document.getElementById('pill-count-assignment_completions');
    if (acBadge) acBadge.textContent = `(${completions.length})`;
    const anBadge = document.getElementById('pill-count-announcements');
    if (anBadge) anBadge.textContent = `(${announcements.length})`;
    const evBadge = document.getElementById('pill-count-events');
    if (evBadge) evBadge.textContent = `(${events.length})`;
    const erBadge = document.getElementById('pill-count-event_registrations');
    if (erBadge) erBadge.textContent = `(${eventRegs.length})`;
    const sBadge = document.getElementById('pill-count-sessions');
    if (sBadge) sBadge.textContent = `(1)`;
  }

  // 2. Load current selected table
  switchDbTable(currentActiveDbTable);
}

async function switchDbTable(tableName) {
  currentActiveDbTable = tableName;

  // Update pills styling
  document.querySelectorAll('.db-pill-btn').forEach(btn => {
    if (btn.getAttribute('data-table') === tableName) {
      btn.className = "db-pill-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white shadow-sm flex items-center gap-1.5 transition";
    } else {
      btn.className = "db-pill-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1.5 transition";
    }
  });

  const titleEl = document.getElementById('current-table-title');
  if (titleEl) titleEl.textContent = `TABLE: ${tableName}`;

  // Fetch rows
  if (isBackendConnected) {
    try {
      const res = await apiCall(`/database/table/${tableName}`);
      if (res?.success && Array.isArray(res.rows)) {
        currentDbRows = res.rows;
      } else {
        currentDbRows = getLocalTableRows(tableName);
      }
    } catch (err) {
      currentDbRows = getLocalTableRows(tableName);
    }
  } else {
    currentDbRows = getLocalTableRows(tableName);
  }

  const badgeEl = document.getElementById('current-table-badge');
  if (badgeEl) badgeEl.textContent = `${currentDbRows.length} Records`;

  renderDbTableGrid(currentDbRows);
}

function getLocalTableRows(tableName) {
  if (tableName === 'users') {
    const students = getStudents();
    return students;
  }
  if (tableName === 'resources') return getResources();
  if (tableName === 'timetable') {
    let branchTables = {};
    try {
      branchTables = JSON.parse(localStorage.getItem('iiitnr_branch_timetables') || '{}');
    } catch (e) {}
    const branches = Object.keys(branchTables).length > 0 
      ? branchTables 
      : (typeof DEFAULT_BRANCH_TIMETABLES !== 'undefined' ? DEFAULT_BRANCH_TIMETABLES : { [activeTimetableBranch]: getTimetable() });
    
    const rows = [];
    Object.entries(branches).forEach(([bName, days]) => {
      if (Array.isArray(days)) {
        days.forEach(dayRow => {
          Object.entries(dayRow.periods || {}).forEach(([time, info]) => {
            rows.push({
              branch: bName,
              day: dayRow.day,
              time_slot: time,
              subject: info.subject,
              room: info.room,
              slot_type: info.type
            });
          });
        });
      }
    });
    return rows;
  }
  if (tableName === 'assignments') return getGlobalAssignments();
  if (tableName === 'assignment_completions') {
    return JSON.parse(localStorage.getItem('iiitnr_assignment_completions') || '[]');
  }
  if (tableName === 'announcements') return getAnnouncements();
  if (tableName === 'events') return getEvents();
  if (tableName === 'event_registrations') {
    return JSON.parse(localStorage.getItem('iiitnr_event_registrations') || '[]');
  }
  if (tableName === 'sessions') {
    const now = new Date();
    return [
      {
        id: 'sess_1',
        user_id: currentUser?.id || 'admin_001',
        user_name: currentUser?.name || 'Revanth',
        role: currentUser?.role || 'admin',
        email: currentUser?.email || 'revanth0246@gmail.com',
        login_time: currentUser?.loginTime || (now.toLocaleDateString('en-IN') + ' ' + now.toLocaleTimeString('en-IN')),
        client_mode: 'Standalone Frontend (100% Client-Side Engine)',
        status: 'Active'
      }
    ];
  }
  if (tableName === 'mess' || tableName === 'mess_menu') return getMessMenu();
  if (tableName === 'exchange') return getExchangeListings();
  return [];
}

function renderDbTableGrid(rows) {
  const headersEl = document.getElementById('db-table-headers');
  const rowsEl = document.getElementById('db-table-rows');
  if (!headersEl || !rowsEl) return;

  if (!rows || rows.length === 0) {
    headersEl.innerHTML = `<tr><th class="p-4 text-center">Column</th></tr>`;
    rowsEl.innerHTML = `<tr><td class="p-6 text-center text-slate-400">No records found in table "${currentActiveDbTable}".</td></tr>`;
    return;
  }

  const isUsersTable = currentActiveDbTable === 'users';
  // Get keys from first row
  const keys = Object.keys(rows[0]);
  headersEl.innerHTML = `
    <tr>
      <th class="px-4 py-3 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">#</th>
      ${keys.map(k => `<th class="px-4 py-3 font-bold border-b border-slate-200 dark:border-slate-800">${k}</th>`).join('')}
      ${isUsersTable ? `<th class="px-4 py-3 font-bold border-b border-slate-200 dark:border-slate-800 text-center">Admin Controls</th>` : ''}
    </tr>
  `;

  rowsEl.innerHTML = rows.map((r, idx) => `
    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition font-mono text-[11px]">
      <td class="px-4 py-3 text-slate-400 font-sans">${idx + 1}</td>
      ${keys.map(k => {
        let val = r[k];
        if (typeof val === 'object') val = JSON.stringify(val);
        if (String(val).startsWith('http') || String(val).startsWith('data:image')) {
          return `<td class="px-4 py-3 max-w-[180px] truncate"><span class="text-blue-500 underline truncate block" title="${val}">[Media / Link]</span></td>`;
        }
        if (k === 'role') {
          const isAdm = String(val).toLowerCase() === 'admin';
          return `<td class="px-4 py-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${isAdm ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'}">${val}</span></td>`;
        }
        return `<td class="px-4 py-3 max-w-[220px] truncate text-slate-800 dark:text-slate-200" title="${String(val || '')}">${val !== undefined && val !== null ? String(val) : '<span class="text-slate-400 italic">NULL</span>'}</td>`;
      }).join('')}
      ${isUsersTable ? `
        <td class="px-4 py-3 text-center whitespace-nowrap">
          ${r.role === 'student' ? `
            <div class="inline-flex items-center gap-1.5">
              <button onclick="promoteUserToAdmin('${r.id}', '${escapeHtml(r.name || '')}', '${escapeHtml(r.email || '')}')" class="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition shadow-sm">
                <i data-lucide="shield-plus" class="w-3 h-3"></i> Make Admin
              </button>
              <button onclick="removeStudentAccount('${r.id}', '${escapeHtml(r.name || '')}', '${escapeHtml(r.roll || '')}')" class="px-2 py-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/70 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition shadow-sm" title="Remove student account">
                <i data-lucide="trash-2" class="w-3 h-3"></i> Remove
              </button>
            </div>
          ` : (r.email === 'revanth0246@gmail.com' ? `
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">Root Admin</span>
          ` : `
            <div class="inline-flex items-center gap-1.5">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">Admin</span>
              <button onclick="demoteUserToStudent('${r.id}', '${escapeHtml(r.name || '')}')" class="text-rose-500 hover:text-rose-700 text-[10px] font-semibold underline">Revoke</button>
            </div>
          `)}
        </td>
      ` : ''}
    </tr>
  `).join('');

  lucide.createIcons();
}

function filterDbTableRows() {
  const q = (document.getElementById('db-search-input')?.value || '').toLowerCase().trim();
  if (!q) {
    renderDbTableGrid(currentDbRows);
    return;
  }
  const filtered = currentDbRows.filter(row => {
    return Object.values(row).some(v => String(v || '').toLowerCase().includes(q));
  });
  renderDbTableGrid(filtered);
}

function setSqlQuery(sql) {
  const input = document.getElementById('db-sql-query-input');
  if (input) {
    input.value = sql;
    input.focus();
  }
}


function executeClientSqlQuery(sql) {
  const cleanSql = sql.trim().replace(/;$/, '');

  // 1. SELECT COUNT(*) query
  const countMatch = cleanSql.match(/^SELECT\s+COUNT\(\*\)\s+(?:as\s+[a-zA-Z0-9_]+\s+)?FROM\s+([a-zA-Z0-9_]+)/i);
  if (countMatch) {
    const tableName = countMatch[1].trim().toLowerCase();
    const rows = getLocalTableRows(tableName);
    return { success: true, type: 'SELECT', rows: [{ 'COUNT(*)': rows.length }], rowCount: 1 };
  }

  // 2. SELECT [cols] FROM [table] [WHERE condition]
  const selectMatch = cleanSql.match(/^SELECT\s+(.*?)\s+FROM\s+([a-zA-Z0-9_]+)(?:\s+WHERE\s+(.*))?$/i);
  if (selectMatch) {
    const fieldsStr = selectMatch[1].trim();
    const tableName = selectMatch[2].trim().toLowerCase();
    const whereClause = selectMatch[3] ? selectMatch[3].trim() : null;

    let rows = getLocalTableRows(tableName);
    if (!rows || rows.length === 0) {
      return { success: true, type: 'SELECT', rows: [], rowCount: 0 };
    }

    if (whereClause) {
      rows = rows.filter(row => {
        const eqMatch = whereClause.match(/([a-zA-Z0-9_]+)\s*=\s*['"]?([^'"]+)['"]?/i);
        if (eqMatch) {
          const col = eqMatch[1];
          const val = eqMatch[2];
          return String(row[col] || '').toLowerCase() === String(val).toLowerCase();
        }
        const likeMatch = whereClause.match(/([a-zA-Z0-9_]+)\s+LIKE\s+['"]%?([^'%"]+)%?['"]/i);
        if (likeMatch) {
          const col = likeMatch[1];
          const val = likeMatch[2];
          return String(row[col] || '').toLowerCase().includes(String(val).toLowerCase());
        }
        return true;
      });
    }

    if (fieldsStr !== '*' && !fieldsStr.toLowerCase().includes('count(')) {
      const fields = fieldsStr.split(',').map(f => f.trim());
      rows = rows.map(row => {
        const proj = {};
        fields.forEach(f => {
          if (f in row) proj[f] = row[f];
        });
        return proj;
      });
    }

    return { success: true, type: 'SELECT', rows, rowCount: rows.length };
  }

  return {
    success: false,
    message: 'Client SQL runner supports SELECT queries (e.g. SELECT * FROM users, SELECT * FROM timetable WHERE day = "Monday", SELECT * FROM resources). Full SQL mutations supported with backend.'
  };
}

async function runCustomSqlQuery() {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Access Denied: SQL Terminal is restricted to Administration.', 'error');
    return;
  }

  const sql = document.getElementById('db-sql-query-input')?.value.trim();
  if (!sql) {
    showToast('Please type an SQL query to execute.', 'error');
    return;
  }

  const outputBox = document.getElementById('db-query-output-box');
  const headersEl = document.getElementById('db-query-headers');
  const rowsEl = document.getElementById('db-query-rows');
  const badgeEl = document.getElementById('db-query-status-badge');

  if (outputBox) outputBox.classList.remove('hidden');

  if (!isBackendConnected) {
    const clientRes = executeClientSqlQuery(sql);
    if (clientRes.success) {
      if (badgeEl) badgeEl.textContent = `${clientRes.rowCount} row(s) returned (Client Engine)`;
      if (clientRes.rows.length === 0) {
        if (headersEl) headersEl.innerHTML = '<tr><th class="p-3">Status</th></tr>';
        if (rowsEl) rowsEl.innerHTML = '<tr><td class="p-4 text-slate-400">Query executed. 0 rows returned.</td></tr>';
        return;
      }
      const keys = Object.keys(clientRes.rows[0]);
      if (headersEl) {
        headersEl.innerHTML = `<tr>${keys.map(k => `<th class="px-4 py-2 font-bold">${k}</th>`).join('')}</tr>`;
      }
      if (rowsEl) {
        rowsEl.innerHTML = clientRes.rows.map(r => `
          <tr class="hover:bg-slate-800/40 font-mono text-[11px]">
            ${keys.map(k => `<td class="px-4 py-2.5 max-w-[200px] truncate">${String(r[k] !== null && r[k] !== undefined ? r[k] : 'NULL')}</td>`).join('')}
          </tr>
        `).join('');
      }
      showToast(`Client query executed: ${clientRes.rowCount} row(s) returned.`, 'success');
    } else {
      if (badgeEl) badgeEl.textContent = 'Query Notice';
      if (headersEl) headersEl.innerHTML = '<tr><th class="p-3">Status</th></tr>';
      if (rowsEl) rowsEl.innerHTML = `<tr><td class="p-4 text-amber-500 font-mono text-xs">${clientRes.message}</td></tr>`;
      showToast(clientRes.message, 'info');
    }
    return;
  }

  try {
    const res = await apiCall('/database/query', 'POST', { sql });
    if (!res || !res.success) {
      showToast(res?.message || 'SQL query failed.', 'error');
      if (badgeEl) badgeEl.textContent = 'Error';
      if (rowsEl) rowsEl.innerHTML = `<tr><td class="p-4 text-rose-500 font-mono text-xs">${res?.message || 'SQL Execution Error'}</td></tr>`;
      return;
    }

    if (res.type === 'SELECT' && Array.isArray(res.rows)) {
      if (badgeEl) badgeEl.textContent = `${res.rowCount} row(s) returned`;
      if (res.rows.length === 0) {
        if (headersEl) headersEl.innerHTML = `<tr><th class="p-3">Status</th></tr>`;
        if (rowsEl) rowsEl.innerHTML = `<tr><td class="p-4 text-slate-400">Query executed successfully. 0 rows returned.</td></tr>`;
        return;
      }
      const keys = Object.keys(res.rows[0]);
      if (headersEl) {
        headersEl.innerHTML = `<tr>${keys.map(k => `<th class="px-4 py-2 font-bold">${k}</th>`).join('')}</tr>`;
      }
      if (rowsEl) {
        rowsEl.innerHTML = res.rows.map(r => `
          <tr class="hover:bg-slate-800/40 font-mono text-[11px]">
            ${keys.map(k => `<td class="px-4 py-2.5 max-w-[200px] truncate">${String(r[k] !== null && r[k] !== undefined ? r[k] : 'NULL')}</td>`).join('')}
          </tr>
        `).join('');
      }
      showToast(`Query executed: ${res.rowCount} row(s) returned.`, 'success');
    } else {
      if (badgeEl) badgeEl.textContent = `${res.changes || 0} change(s) applied`;
      if (headersEl) headersEl.innerHTML = `<tr><th class="p-3">Execution Status</th></tr>`;
      if (rowsEl) rowsEl.innerHTML = `<tr><td class="p-4 text-emerald-400 font-mono">Mutation successful. Changes: ${res.changes || 0}, Last ID: ${res.lastID || 'N/A'}.</td></tr>`;
      showToast('Mutation executed successfully.', 'success');
      renderDatabaseView();
    }
  } catch (err) {
    showToast('SQL Execution Error: ' + err.message, 'error');
  }
}

async function exportDatabaseDump() {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Access Denied: Database export is restricted to Administration.', 'error');
    return;
  }

  if (isBackendConnected) {
    try {
      const headers = {};
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
      if (currentUser?.role) headers['x-user-role'] = currentUser.role;
      const res = await fetch(`${API_BASE}/database/export`, { headers });
      if (!res.ok) {
        showToast('Export failed: Administration access required.', 'error');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `iiitnr_campus_hub_db_export_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Database JSON exported successfully!', 'success');
    } catch (err) {
      showToast('Export failed: ' + err.message, 'error');
    }
  } else {
    // Generate local JSON export
    const localDump = {
      timestamp: new Date().toISOString(),
      engine: 'LocalStorage Cache',
      tables: {
        users: [DEFAULT_ADMIN, ...getStudents()],
        timetable: getTimetable(),
        resources: getResources(),
        assignments: getGlobalAssignments(),
        announcements: getAnnouncements(),
        events: getEvents()
      }
    };
    const blob = new Blob([JSON.stringify(localDump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'iiitnr_campus_hub_db_export.json';
    a.click();
    showToast('Database JSON exported successfully!', 'success');
  }
}

async function resetDatabaseFromUI() {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Access Denied: Database reset is restricted to Administration.', 'error');
    return;
  }

  if (!confirm('Are you sure you want to re-seed the SQLite database to clean defaults?')) return;
  if (isBackendConnected) {
    const res = await apiCall('/database/reset', 'POST');
    if (res?.success) {
      showToast('SQLite database re-seeded successfully!', 'success');
      await syncAllFromBackend();
      renderDatabaseView();
    } else {
      showToast('Failed to reset database.', 'error');
    }
  } else {
    localStorage.removeItem('iiitnr_v3_synced');
    initStorage();
    showToast('Local database reset to official defaults.', 'success');
    renderDatabaseView();
  }
}

// ==========================================
// 14. ADMIN ROLE DELEGATION & MANAGEMENT
// ==========================================

let currentAdminModalTab = 'students';
let cachedAdminModalStudents = [];

async function openMakeAdminModal() {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Access Denied: Only Administrators can appoint or manage administrators.', 'error');
    return;
  }

  const modal = document.getElementById('modal-make-admin');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    switchAdminModalTab('students');
    await loadAdminModalData();
    if (window.lucide) lucide.createIcons();
  }
}

function switchAdminModalTab(tab) {
  currentAdminModalTab = tab;
  const studentsTabBtn = document.getElementById('tab-btn-students');
  const promoteTabBtn = document.getElementById('tab-btn-promote');
  const createTabBtn = document.getElementById('tab-btn-create');

  const studentsSection = document.getElementById('section-admin-students');
  const promoteForm = document.getElementById('form-promote-admin');
  const createForm = document.getElementById('form-create-admin');

  const activeClasses = "flex-1 py-2 rounded-xl bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm flex items-center justify-center gap-1.5 transition";
  const inactiveClasses = "flex-1 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-1.5 transition";

  if (studentsTabBtn) studentsTabBtn.className = tab === 'students' ? activeClasses : inactiveClasses;
  if (promoteTabBtn) promoteTabBtn.className = tab === 'promote' ? activeClasses : inactiveClasses;
  if (createTabBtn) createTabBtn.className = tab === 'create' ? activeClasses : inactiveClasses;

  if (studentsSection) studentsSection.classList.toggle('hidden', tab !== 'students');
  if (promoteForm) promoteForm.classList.toggle('hidden', tab !== 'promote');
  if (createForm) createForm.classList.toggle('hidden', tab !== 'create');

  if (window.lucide) lucide.createIcons();
}

async function loadAdminModalData() {
  const selectEl = document.getElementById('promote-user-select');
  const adminsListEl = document.getElementById('modal-admins-list');
  const adminBadgeEl = document.getElementById('active-admins-count-badge');
  const studentBadgeEl = document.getElementById('active-students-count-badge');

  let allUsers = [];
  if (isBackendConnected) {
    try {
      const res = await apiCall('/auth/users');
      if (res?.success && Array.isArray(res.users)) {
        allUsers = res.users;
      } else {
        const stuRes = await apiCall('/auth/students');
        const students = stuRes?.students ? mergeStudentLists(getStudents(), stuRes.students) : getStudents();
        allUsers = [DEFAULT_ADMIN, ...students];
      }
    } catch (e) {
      allUsers = [DEFAULT_ADMIN, ...getStudents()];
    }
  } else {
    allUsers = [DEFAULT_ADMIN, ...getStudents()];
  }

  const students = allUsers.filter(u => u.role === 'student');
  cachedAdminModalStudents = students;

  // 1. Update students directory count and render student list
  if (studentBadgeEl) {
    studentBadgeEl.textContent = `${students.length} Student${students.length !== 1 ? 's' : ''}`;
  }
  renderAdminModalStudentsList(students);

  // 2. Populate student select dropdown for Promote tab
  if (selectEl) {
    if (students.length === 0) {
      selectEl.innerHTML = `<option value="">No registered students found</option>`;
    } else {
      selectEl.innerHTML = students.map(s => `
        <option value="${s.id}">${escapeHtml(s.name)} (${escapeHtml(s.roll || 'N/A')} - ${escapeHtml(s.email)})</option>
      `).join('');
    }
  }

  // 3. Populate active admins list
  if (adminsListEl) {
    const admins = allUsers.filter(u => u.role === 'admin');
    if (adminBadgeEl) adminBadgeEl.textContent = `${admins.length} Admin${admins.length > 1 ? 's' : ''}`;

    if (admins.length === 0) {
      adminsListEl.innerHTML = `<p class="text-slate-400 italic">No administrators found.</p>`;
    } else {
      adminsListEl.innerHTML = admins.map(a => `
        <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
          <div class="flex items-center gap-2.5 truncate">
            <div class="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
              ${(a.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div class="truncate">
              <div class="font-bold text-slate-800 dark:text-slate-100 truncate flex items-center gap-1.5">
                <span>${escapeHtml(a.name)}</span>
                ${a.email === 'revanth0246@gmail.com' ? '<span class="text-[9px] px-1.5 py-0.2 rounded font-extrabold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">Root</span>' : ''}
              </div>
              <p class="text-[11px] text-slate-400 truncate">${escapeHtml(a.email)} • ${escapeHtml(a.designation || 'Administrator')}</p>
            </div>
          </div>
          <div>
            ${a.email === 'revanth0246@gmail.com' ? `
              <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60">Active Root</span>
            ` : `
              <button type="button" onclick="demoteUserToStudent('${a.id}', '${escapeHtml(a.name)}')" class="px-2 py-1 text-[10px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition">
                Revoke Admin
              </button>
            `}
          </div>
        </div>
      `).join('');
    }
  }

  if (window.lucide) lucide.createIcons();
}

function renderAdminModalStudentsList(list) {
  const container = document.getElementById('modal-students-list');
  if (!container) return;

  if (!list || list.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-slate-400">
        <i data-lucide="user-x" class="w-8 h-8 mx-auto mb-2 opacity-50"></i>
        <p class="font-medium text-xs">No registered students found.</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  container.innerHTML = list.map(s => {
    const avatar = s.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces';
    const name = escapeHtml(s.name || 'Unnamed Student');
    const roll = escapeHtml(s.roll || 'N/A');
    const branch = escapeHtml(s.branch || 'Data Science & AI');
    const email = escapeHtml(s.email || '');
    const id = s.id;

    return `
      <div class="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-600 transition">
        <div class="flex items-center gap-3 truncate">
          <img src="${avatar}" alt="${name}" class="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 flex-shrink-0" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces'" />
          <div class="truncate">
            <div class="font-bold text-slate-900 dark:text-slate-100 truncate flex items-center gap-1.5">
              <span>${name}</span>
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">${roll}</span>
            </div>
            <p class="text-[11px] text-slate-400 truncate">${branch} • ${email}</p>
          </div>
        </div>
        <div class="flex items-center gap-1.5 flex-shrink-0">
          <button type="button" onclick="promoteUserToAdmin('${id}', '${name}', '${email}')" class="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition" title="Promote to Administrator">
            <i data-lucide="shield-plus" class="w-3 h-3"></i> Make Admin
          </button>
          <button type="button" onclick="removeStudentAccount('${id}', '${name}', '${roll}')" class="px-2 py-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/70 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition shadow-sm" title="Remove student permanently">
            <i data-lucide="trash-2" class="w-3 h-3"></i> Remove
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function filterAdminStudentsList() {
  const q = (document.getElementById('admin-student-search-input')?.value || '').toLowerCase().trim();
  if (!q) {
    renderAdminModalStudentsList(cachedAdminModalStudents);
    return;
  }
  const filtered = cachedAdminModalStudents.filter(s => {
    return (s.name && s.name.toLowerCase().includes(q)) ||
           (s.roll && s.roll.toLowerCase().includes(q)) ||
           (s.branch && s.branch.toLowerCase().includes(q)) ||
           (s.email && s.email.toLowerCase().includes(q));
  });
  renderAdminModalStudentsList(filtered);
}

async function removeStudentAccount(userId, name, roll) {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only Administrators can remove student accounts.', 'error');
    return;
  }

  const studentDisplay = name ? `${name} (${roll || userId})` : (roll || userId);
  if (!confirm(`Are you sure you want to permanently remove student ${studentDisplay}?\n\nThis will delete their account and all associated records (event registrations, assignment completions, notifications).`)) {
    return;
  }

  let success = false;
  let message = '';

  if (isBackendConnected) {
    try {
      let res = await apiCall(`/auth/students/${encodeURIComponent(userId || roll)}`, 'DELETE');
      if (!res?.success && (userId && roll && userId !== roll)) {
        res = await apiCall(`/auth/students/${encodeURIComponent(roll)}`, 'DELETE');
      }
      if (!res?.success) {
        res = await apiCall(`/auth/users/${encodeURIComponent(userId)}`, 'DELETE');
      }

      if (res?.success) {
        success = true;
        message = res.message || `Student ${studentDisplay} removed successfully!`;
      } else {
        showToast(res?.message || 'Failed to remove student from database.', 'error');
        return;
      }
    } catch (e) {
      console.warn('API error deleting student, falling back to local cache:', e);
    }
  }

  // Always update local cache & localStorage
  const students = getStudents();
  const cleanRoll = roll ? String(roll).trim().toUpperCase() : null;
  if (cleanRoll) {
    try {
      let removedList = JSON.parse(localStorage.getItem('iiitnr_removed_students') || '[]');
      if (!removedList.includes(cleanRoll)) {
        removedList.push(cleanRoll);
        localStorage.setItem('iiitnr_removed_students', JSON.stringify(removedList));
      }
    } catch (e) {}
  }
  const filtered = students.filter(s => {
    if (userId && (s.id === userId || String(s.id) === String(userId))) return false;
    if (cleanRoll && s.roll && String(s.roll).trim().toUpperCase() === cleanRoll) return false;
    return true;
  });
  setStudents(filtered);

  // Clean local completions & notifications
  try {
    if (cleanRoll) {
      let completions = JSON.parse(localStorage.getItem('iiitnr_assignment_completions') || '[]');
      completions = completions.filter(c => String(c.student_roll || c.studentRoll).toUpperCase() !== cleanRoll);
      localStorage.setItem('iiitnr_assignment_completions', JSON.stringify(completions));

      let notifs = JSON.parse(localStorage.getItem('iiitnr_notifications') || '[]');
      notifs = notifs.filter(n => !n.recipient_roll || String(n.recipient_roll).toUpperCase() !== cleanRoll);
      localStorage.setItem('iiitnr_notifications', JSON.stringify(notifs));
    }
  } catch (err) {}

  showToast(message || `Student ${studentDisplay} removed successfully!`, 'success');

  if (isBackendConnected) {
    await syncAllFromBackend();
  }

  if (activeView === 'database') {
    renderDatabaseView();
  }

  await loadAdminModalData();
}

async function submitPromoteAdminForm(event) {
  event.preventDefault();
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied.', 'error');
    return;
  }

  const selectedUserId = document.getElementById('promote-user-select')?.value;
  const roll = document.getElementById('promote-roll-input')?.value.trim();
  const email = document.getElementById('promote-email-input')?.value.trim();
  const designation = document.getElementById('promote-designation-input')?.value.trim() || 'Campus Administrator';

  const payload = { designation };
  if (roll) payload.roll = roll;
  else if (email) payload.email = email;
  else if (selectedUserId) payload.userId = selectedUserId;
  else {
    showToast('Please select a student or enter a Roll Number/Email.', 'error');
    return;
  }

  if (isBackendConnected) {
    try {
      const res = await apiCall('/auth/make-admin', 'POST', payload);
      if (res?.success) {
        showToast(res.message || 'User promoted to Administrator successfully!', 'success');
        closeModal('modal-make-admin');
        await syncAllFromBackend();
        if (activeView === 'database') renderDatabaseView();
        return;
      } else {
        showToast(res?.message || 'Failed to promote user to Administrator.', 'error');
        return;
      }
    } catch (e) {
      showToast('Error communicating with SQLite backend.', 'error');
    }
  }

  // Local fallback
  const students = getStudents();
  const targetIdx = students.findIndex(s => s.id === selectedUserId || (roll && s.roll.toUpperCase() === roll.toUpperCase()) || (email && s.email.toLowerCase() === email.toLowerCase()));
  if (targetIdx !== -1) {
    students[targetIdx].role = 'admin';
    students[targetIdx].designation = designation;
    setStudents(students);
    showToast(`User ${students[targetIdx].name} promoted to Administrator in local cache!`, 'success');
    closeModal('modal-make-admin');
    if (activeView === 'database') renderDatabaseView();
  } else {
    showToast('User not found in local records.', 'error');
  }
}

async function submitCreateAdminForm(event) {
  event.preventDefault();
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied.', 'error');
    return;
  }

  const name = document.getElementById('newadmin-name')?.value.trim();
  const email = document.getElementById('newadmin-email')?.value.trim().toLowerCase();
  const password = document.getElementById('newadmin-pass')?.value.trim();
  const department = document.getElementById('newadmin-dept')?.value.trim() || 'Office of Academic Affairs';
  const designation = document.getElementById('newadmin-designation')?.value.trim() || 'Campus Administrator';

  if (!name || !email || !password) {
    showToast('Please fill in Name, Email, and Passkey.', 'error');
    return;
  }

  if (isBackendConnected) {
    try {
      const res = await apiCall('/auth/create-admin', 'POST', { name, email, password, department, designation });
      if (res?.success) {
        showToast(res.message || 'New Administrator account created successfully!', 'success');
        closeModal('modal-make-admin');
        await syncAllFromBackend();
        if (activeView === 'database') renderDatabaseView();
        return;
      } else {
        showToast(res?.message || 'Failed to create Administrator account.', 'error');
        return;
      }
    } catch (e) {
      showToast('Error communicating with SQLite backend.', 'error');
    }
  }

  // Local fallback
  const newAdmin = {
    id: 'admin_' + Date.now(),
    role: 'admin',
    name,
    email,
    department,
    designation,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces'
  };
  const students = getStudents();
  students.push(newAdmin);
  setStudents(students);
  showToast(`Administrator ${name} created successfully!`, 'success');
  closeModal('modal-make-admin');
  if (activeView === 'database') renderDatabaseView();
}

async function promoteUserToAdmin(userId, name, email) {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only Administrators can promote other users.', 'error');
    return;
  }

  if (!confirm(`Are you sure you want to grant full Administrator privileges to ${name || email}?`)) {
    return;
  }

  if (isBackendConnected) {
    const res = await apiCall('/auth/make-admin', 'POST', { userId, email });
    if (res?.success) {
      showToast(res.message || `${name} is now an Administrator!`, 'success');
      await syncAllFromBackend();
      switchDbTable('users');
    } else {
      showToast(res?.message || 'Failed to promote user.', 'error');
    }
  } else {
    const students = getStudents();
    const idx = students.findIndex(s => s.id === userId);
    if (idx !== -1) {
      students[idx].role = 'admin';
      setStudents(students);
      showToast(`${name} is now an Administrator in local cache!`, 'success');
      switchDbTable('users');
    }
  }
}

async function demoteUserToStudent(userId, name) {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied.', 'error');
    return;
  }

  if (!confirm(`Are you sure you want to revoke Administrator privileges from ${name}?`)) {
    return;
  }

  if (isBackendConnected) {
    const res = await apiCall(`/auth/users/${userId}/role`, 'PUT', { role: 'student' });
    if (res?.success) {
      showToast(res.message || 'Administrator privileges revoked.', 'info');
      await syncAllFromBackend();
      if (currentActiveDbTable === 'users') switchDbTable('users');
      await loadAdminModalData();
    } else {
      showToast(res?.message || 'Failed to revoke privileges.', 'error');
    }
  } else {
    const students = getStudents();
    const idx = students.findIndex(s => s.id === userId);
    if (idx !== -1) {
      students[idx].role = 'student';
      setStudents(students);
      showToast('Admin privileges revoked in local cache.', 'info');
      if (currentActiveDbTable === 'users') switchDbTable('users');
      await loadAdminModalData();
    }
  }
}


// ==========================================
// PRE-LOGIN SPLASH & ROTATING ORBITAL HUB CONTROLLER
// ==========================================
let splashDismissed = false;
let splashAutoDismissTimer = null;

function dismissSplashScreen() {
  if (splashDismissed) return;
  splashDismissed = true;
  if (splashAutoDismissTimer) {
    clearTimeout(splashAutoDismissTimer);
    splashAutoDismissTimer = null;
  }

  const splash = document.getElementById('splash-loading-screen');
  if (splash) {
    splash.classList.add('dismissed');
    setTimeout(() => {
      splash.style.display = 'none';
      if (window.lucide) lucide.createIcons();
    }, 700);
  }
}
window.dismissSplashScreen = dismissSplashScreen;

function initSplashScreen() {
  // Listen for keyboard escape, enter or space to skip to login immediately
  window.addEventListener('keydown', (e) => {
    if (!splashDismissed && (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ')) {
      dismissSplashScreen();
    }
  });

  // Smooth automatic transition to login after allowing student to view the rotating orbital constellation
  splashAutoDismissTimer = setTimeout(() => {
    dismissSplashScreen();
  }, 2600);
}
window.initSplashScreen = initSplashScreen;

// Initial Boot
window.addEventListener('DOMContentLoaded', () => {
  initSplashScreen();
  initStorage();
  lucide.createIcons();
});

// ==========================================
// 15. CONTINUOUS CROSS-DEVICE SYNC & VISIBILITY CONTROLLER
// ==========================================

if (typeof window !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && isBackendConnected) {
      if (currentUser?.role === 'admin' && activeView === 'database') {
        renderDatabaseView();
      } else {
        syncAllFromBackend();
      }
    }
  });

  window.addEventListener('focus', () => {
    if (isBackendConnected) {
      if (currentUser?.role === 'admin' && activeView === 'database') {
        renderDatabaseView();
      } else {
        syncAllFromBackend();
      }
    }
  });

  // Background heartbeat sync: auto-syncs fresh state across devices every 10 seconds
  setInterval(() => {
    if (!isBackendConnected) {
      checkBackendConnection();
      return;
    }
    if (currentUser?.role === 'admin' && activeView === 'database') {
      renderDatabaseView();
    } else {
      syncAllFromBackend();
    }
  }, 10000);
}

// ==========================================
// 16. ENROLLED STUDENTS DIRECTORY CONTROLLER
// ==========================================

let studentsDirBranchFilter = 'All';
let cachedDirectoryStudents = [];

async function renderStudentsDirectoryView(showToastNotice = false) {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Access Denied: Students Directory is restricted to Administration.', 'error');
    navigateTo('home');
    return;
  }

  updateUserUIElements();
  if (window.lucide) lucide.createIcons();

  let students = [];
  if (isBackendConnected) {
    try {
      const res = await apiCall('/auth/students');
      if (res?.success && Array.isArray(res.students)) {
        const local = getStudents();
        students = mergeStudentLists(local, res.students);
        setStudents(students);
      } else {
        students = getStudents();
      }
    } catch (e) {
      students = getStudents();
    }
  } else {
    students = getStudents();
  }

  cachedDirectoryStudents = students;

  // Update counts
  const allEl = document.getElementById('stu-count-all');
  const dsaiEl = document.getElementById('stu-count-dsai');
  const cseEl = document.getElementById('stu-count-cse');
  const eceEl = document.getElementById('stu-count-ece');
  const navBadge = document.getElementById('nav-student-count-badge');

  if (allEl) allEl.textContent = students.length;
  if (dsaiEl) dsaiEl.textContent = students.filter(s => (s.branch || '').includes('Data')).length;
  if (cseEl) cseEl.textContent = students.filter(s => (s.branch || '').includes('Computer')).length;
  if (eceEl) eceEl.textContent = students.filter(s => (s.branch || '').includes('Electronics')).length;
  if (navBadge) navBadge.textContent = students.length;

  filterStudentsDirectory();

  if (showToastNotice) {
    showToast('Enrolled students directory refreshed from SQLite database.', 'success');
  }
}

function filterStudentsDirectoryByBranch(branch) {
  studentsDirBranchFilter = branch;
  document.querySelectorAll('.btn-stu-branch-filter').forEach(btn => {
    if (btn.getAttribute('data-branch') === branch) {
      btn.className = "btn-stu-branch-filter px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white shadow-sm transition";
    } else {
      btn.className = "btn-stu-branch-filter px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition";
    }
  });
  filterStudentsDirectory();
}

function filterStudentsDirectory() {
  const q = (document.getElementById('students-dir-search-input')?.value || '').toLowerCase().trim();
  const container = document.getElementById('students-directory-grid');
  if (!container) return;

  let list = cachedDirectoryStudents;
  if (studentsDirBranchFilter !== 'All') {
    list = list.filter(s => (s.branch || '') === studentsDirBranchFilter);
  }
  if (q) {
    list = list.filter(s => {
      return (s.name && s.name.toLowerCase().includes(q)) ||
             (s.roll && s.roll.toLowerCase().includes(q)) ||
             (s.email && s.email.toLowerCase().includes(q)) ||
             (s.branch && s.branch.toLowerCase().includes(q));
    });
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
          <i data-lucide="users-2" class="w-8 h-8"></i>
        </div>
        <h3 class="text-base font-bold text-slate-800 dark:text-slate-100">No Enrolled Students Found</h3>
        <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">No student records match the search filter. Newly registered students will automatically appear here in real-time.</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  container.innerHTML = list.map(s => {
    const avatar = s.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=faces';
    const name = escapeHtml(s.name || 'Student');
    const roll = escapeHtml(s.roll || 'N/A');
    const branch = escapeHtml(s.branch || 'Data Science & AI');
    const year = escapeHtml(s.year || '1st Year');
    const sem = escapeHtml(s.semester || 'Semester 1');
    const cgpa = escapeHtml(s.cgpa || '8.0');
    const email = escapeHtml(s.email || '');
    const id = s.id;

    return `
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
        <div class="flex items-start gap-3">
          <img src="${avatar}" alt="${name}" class="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/20 flex-shrink-0" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=faces'" />
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-1">
              <h4 class="font-bold text-sm text-slate-900 dark:text-white truncate">${name}</h4>
              <span class="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">${roll}</span>
            </div>
            <p class="text-xs font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">${branch}</p>
            <p class="text-[11px] text-slate-400 truncate">${email}</p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl text-center">
          <div>
            <div class="text-[10px] uppercase font-bold text-slate-400">Year</div>
            <div class="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">${year}</div>
          </div>
          <div>
            <div class="text-[10px] uppercase font-bold text-slate-400">Sem</div>
            <div class="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">${sem}</div>
          </div>
          <div>
            <div class="text-[10px] uppercase font-bold text-slate-400">CGPA</div>
            <div class="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">${cgpa}</div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button type="button" onclick="promoteUserToAdmin('${id}', '${name}', '${email}')" class="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition" title="Promote to Administrator">
            <i data-lucide="shield-plus" class="w-3.5 h-3.5"></i> Make Admin
          </button>
          <button type="button" onclick="removeStudentAccount('${id}', '${name}', '${roll}')" class="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/70 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition shadow-sm" title="Remove student account permanently">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Remove
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

// ==========================================
// 17. REAL-TIME SUB-SECOND SSE SYNCHRONIZATION ENGINE
// ==========================================

let realTimeEventSource = null;

function initRealtimeSync() {
  if (typeof window === 'undefined' || typeof EventSource === 'undefined') return;
  if (realTimeEventSource) {
    try { realTimeEventSource.close(); } catch (e) {}
  }

  try {
    const sseUrl = `${API_BASE}/realtime/stream`;
    realTimeEventSource = new EventSource(sseUrl);

    realTimeEventSource.onopen = () => {
      console.log('⚡ Real-time SSE Sync stream connected to SQLite backend');
    };

    realTimeEventSource.onmessage = async (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'connected') return;

        console.log(`⚡ Real-time sync update received in next second: ${payload.type}`, payload);

        // Immediate sub-second UI synchronization based on update event
        switch (payload.type) {
          case 'timetable_updated': {
            const userBranch = currentUser?.branch || activeTimetableBranch;
            const branchQuery = userBranch ? `?branch=${encodeURIComponent(userBranch)}` : '';
            const res = await fetch(`${API_BASE}/timetable${branchQuery}`).then(r => r.json());
            if (res.success) {
              if (res.branches) localStorage.setItem('iiitnr_branch_timetables', JSON.stringify(res.branches));
              setTimetable(res.timetable, res.branch || activeTimetableBranch);
              if (activeView === 'timetable' || activeView === 'home') refreshAllViews();
              showToast('Class Timetable updated by Administration in real-time!', 'info');
            }
            break;
          }

          case 'announcements_updated': {
            const res = await fetch(`${API_BASE}/announcements`).then(r => r.json());
            if (res.success && res.announcements) {
              setAnnouncements(res.announcements);
              refreshAllViews();
              showToast('New campus announcement broadcasted by Administration!', 'info');
            }
            break;
          }

          case 'assignments_updated': {
            const rollQuery = currentUser?.roll ? `?roll=${encodeURIComponent(currentUser.roll.trim().toUpperCase())}` : '';
            const res = await fetch(`${API_BASE}/assignments${rollQuery}`).then(r => r.json());
            if (res.success && res.assignments) {
              setGlobalAssignments(res.assignments);
              refreshAllViews();
              showToast('Coursework assignments updated in real-time!', 'info');
            }
            break;
          }

          case 'assignment_completion_updated': {
            const rollQuery = currentUser?.roll ? `?roll=${encodeURIComponent(currentUser.roll.trim().toUpperCase())}` : '';
            const res = await fetch(`${API_BASE}/assignments${rollQuery}`).then(r => r.json());
            if (res.success && res.assignments) {
              setGlobalAssignments(res.assignments);
              refreshAllViews();
            }
            break;
          }

          case 'events_updated': {
            const rollQuery = currentUser?.roll ? `?roll=${encodeURIComponent(currentUser.roll.trim().toUpperCase())}` : '';
            const res = await fetch(`${API_BASE}/events${rollQuery}`).then(r => r.json());
            if (res.success && res.events) {
              setEvents(res.events);
              refreshAllViews();
              showToast('Campus events schedule updated in real-time!', 'info');
            }
            break;
          }

          case 'event_registration_updated': {
            const rollQuery = currentUser?.roll ? `?roll=${encodeURIComponent(currentUser.roll.trim().toUpperCase())}` : '';
            const res = await fetch(`${API_BASE}/events${rollQuery}`).then(r => r.json());
            if (res.success && res.events) {
              setEvents(res.events);
              refreshAllViews();
            }
            break;
          }

          case 'resources_updated': {
            const rollQuery = currentUser?.roll ? `?roll=${encodeURIComponent(currentUser.roll.trim().toUpperCase())}` : '';
            const res = await fetch(`${API_BASE}/resources${rollQuery}`).then(r => r.json());
            if (res.success && res.resources) {
              setResources(res.resources);
              if (activeView === 'resources') renderResourcesView();
            }
            break;
          }

          case 'student_registered': {
            // Immediately sync registered students
            const stuRes = await fetch(API_BASE + '/auth/students').then(r => r.json());
            if (stuRes.success && Array.isArray(stuRes.students)) {
              const localStudents = getStudents();
              const merged = mergeStudentLists(localStudents, stuRes.students);
              setStudents(merged);
            }
            if (currentUser?.role === 'admin') {
              showToast(`🎓 New student registered: ${payload.data?.student?.name || 'Student'} (${payload.data?.student?.roll || ''})`, 'success');
              if (activeView === 'database') renderDatabaseView();
              if (activeView === 'students') renderStudentsDirectoryView();
              if (activeView === 'home') renderHomeView();
              loadAdminModalData();
            }
            break;
          }

          case 'student_removed': {
            const cleanUserRoll = currentUser?.roll ? currentUser.roll.toUpperCase() : '';
            if (currentUser?.role === 'student' && payload.data?.roll && payload.data.roll.toUpperCase() === cleanUserRoll) {
              handleLogout();
              showToast('Your student account was removed by the administrator.', 'error');
              return;
            }
            const stuRes = await fetch(`${API_BASE}/auth/students`).then(r => r.json());
            if (stuRes.success && stuRes.students) setStudents(stuRes.students);
            if (currentUser?.role === 'admin') {
              if (activeView === 'database') renderDatabaseView();
              if (activeView === 'students') renderStudentsDirectoryView();
              if (activeView === 'home') renderHomeView();
              loadAdminModalData();
            }
            break;
          }

          case 'user_role_changed':
          case 'database_updated': {
            await syncAllFromBackend();
            if (activeView === 'database') renderDatabaseView();
            if (activeView === 'students') renderStudentsDirectoryView();
            if (activeView === 'home') renderHomeView();
            break;
          }

          default:
            await syncAllFromBackend();
            break;
        }
      } catch (e) {
        console.warn('Real-time message parse error:', e);
      }
    };

    realTimeEventSource.onerror = (err) => {
      console.warn('Real-time SSE disconnected, native auto-reconnecting...', err);
    };
  } catch (err) {
    console.warn('Could not initialize EventSource:', err);
  }
}


// ==========================================
// ALL STUDENTS LOGIN & QUICK SELECTOR ENGINE
// ==========================================

function populateStudentQuickSelect() {
  const select = document.getElementById('student-quick-select');
  if (!select) return;

  const students = getStudents();
  select.innerHTML = '<option value="">-- Choose Any Student to Auto-Fill & Login --</option>';

  students.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.roll;
    opt.textContent = `${s.name} (${s.roll}) - ${s.branch} (${s.year})`;
    select.appendChild(opt);
  });
}

function handleStudentQuickSelect(roll) {
  if (!roll) return;
  const students = getStudents();
  const student = students.find(s => s.roll === roll);
  if (!student) return;

  const rollInput = document.getElementById('student-roll');
  const passInput = document.getElementById('student-pass');
  if (rollInput) rollInput.value = student.roll;
  if (passInput) passInput.value = student.password || 'Test@1234';
  showToast(`Selected student: ${student.name} (${student.roll})`, 'info');
}

function selectStudentLogin(roll, pass) {
  switchAuthTab('student');
  const rollInput = document.getElementById('student-roll');
  const passInput = document.getElementById('student-pass');
  if (rollInput) rollInput.value = roll;
  if (passInput) passInput.value = pass || 'Test@1234';
  
  const form = document.getElementById('student-login-form');
  if (form) {
    handleAuthLogin(new Event('submit'), 'student');
  }
}

function openAllStudentsLoginModal() {
  const modal = document.getElementById('modal-all-students-login');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    renderAllStudentsLoginModalList();
    if (window.lucide) lucide.createIcons();
  }
}

function renderAllStudentsLoginModalList(searchQuery = '') {
  const container = document.getElementById('all-students-login-list');
  if (!container) return;

  const students = getStudents();
  const q = searchQuery.toLowerCase().trim();
  const filtered = q
    ? students.filter(s => 
        (s.name && s.name.toLowerCase().includes(q)) || 
        (s.roll && s.roll.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.branch && s.branch.toLowerCase().includes(q))
      )
    : students;

  const countBadge = document.getElementById('all-students-modal-count');
  if (countBadge) countBadge.textContent = `${filtered.length} of ${students.length} Students`;

  if (filtered.length === 0) {
    container.innerHTML = '<div class="p-6 text-center text-xs text-slate-400">No matching students found for your search.</div>';
    return;
  }

  container.innerHTML = filtered.map(s => {
    const avatar = s.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces';
    const pwd = s.password || 'Test@1234';
    return `
      <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-3 hover:border-blue-500 transition">
        <div class="flex items-center gap-2.5 truncate">
          <img src="${avatar}" alt="${s.name}" class="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 flex-shrink-0" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces'" />
          <div class="truncate">
            <div class="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5 truncate">
              <span>${s.name}</span>
              <span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">${s.roll}</span>
            </div>
            <p class="text-[10px] text-slate-400 truncate mt-0.5">${s.branch} • ${s.year}</p>
          </div>
        </div>
        <button type="button" onclick="closeModal('modal-all-students-login'); selectStudentLogin('${s.roll}', '${pwd}')" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm transition flex-shrink-0">
          <i data-lucide="log-in" class="w-3.5 h-3.5"></i> Sign In
        </button>
      </div>
    `;
  }).join('');
}

function filterAllStudentsLoginModal(val) {
  renderAllStudentsLoginModalList(val);
  if (window.lucide) lucide.createIcons();
}
