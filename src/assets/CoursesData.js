export const coursesData = [
  { id: 1, students: 32, assignments: 6, name: 'Math Basics', desc: 'Learn fundamental math concepts including numbers, arithmetic, and algebra.', teacher: 'Mr. Sharma', coordinator: 'Mr. Sharma', category: 'Ongoing', starred: false },
  { id: 2, students: 32, assignments: 6, name: 'Physics Fundamentals', desc: 'Understand the laws of nature with a focus on motion, energy, and force.', teacher: 'Ms. Patel', coordinator: 'Ms. Patel', category: 'Completed', starred: true },
  { id: 3, students: 32, assignments: 6, name: 'Gujarati Grammar', desc: 'Dive into the structure of Gujarati language and strengthen your grammar.', teacher: 'Mr. Bhatt', coordinator: 'Mr. Bhatt', category: 'Ongoing', starred: false },
  { id: 4, students: 32, assignments: 6, name: 'Computer Science', desc: 'Basics of computer operations, programming, and digital logic.', teacher: 'Ms. Desai', coordinator: 'Ms. Desai', category: 'Upcoming', starred: false },
  { id: 5, students: 32, assignments: 6, desc: "This is description of the subject", name: 'Chemistry', teacher: 'Dr. Meera', coordinator: 'Dr. Meera', category: 'Ongoing', starred: false },
  { id: 6, students: 32, assignments: 6, desc: "This is description of the subject", name: 'Civics', teacher: 'Mrs. Khan', coordinator: 'Mrs. Khan', category: 'Completed', starred: true },
  { id: 7, students: 32, assignments: 6, desc: "This is description of the subject", name: 'Calculus', teacher: 'Mr. Mathur', coordinator: 'Mr. Mathur', category: 'Ongoing', starred: false },
  { id: 8, students: 32, assignments: 6, desc: "This is description of the subject", name: 'Intro to Biology', teacher: 'Dr. Sen', coordinator: 'Dr. Sen', category: 'Ongoing', starred: false },
  { id: 9, students: 32, assignments: 6, desc: "This is description of the subject", name: 'Geography', teacher: 'Ms. Rani', coordinator: 'Ms. Rani', category: 'Ongoing', starred: true },
];


export const allSubjectsData = {
  "1": [ // Math Basics
    {
      id: 101,
      title: "Numbers and Operations",
      content: [
        {
          id: "m1v1",
          type: "Video",
          title: "Introduction to Numbers",
          link: "https://www.youtube.com/watch?v=numbers101",
          completed: false
        },
        {
          id: "m1a1",
          type: "Assignment",
          max_size: 5,
          file_type: "PDF",
          max_files: 5,
          title: "Basic Arithmetic Assignment",
          due: "July 25",
          dueDate: "2025-07-25",
          submitted: false,
          instructions: "Solve the given arithmetic problems from the worksheet.\n worksheet:https://examlplelink.com",
          fileLimit: "PDF only. Max size: 10MB"
        }
      ]
    },
    {
      id: 102,
      title: "Algebra Basics",
      content: [
        {
          id: "m2v1",
          type: "Video",
          title: "Variables and Expressions",
          link: "https://www.youtube.com/watch?v=algebra101",
          completed: true
        },
        {
          id: "m2a1",
          type: "Assignment",
          max_size: 5,
          file_type: "PDF",

          max_files: 5,

          title: "Algebra Worksheet",
          due: "July 28",
          dueDate: "2025-07-28",
          submitted: true,
          instructions: "Complete the attached algebra problems.",
          fileLimit: "PDF only. Max size: 5MB"
        }
      ]
    }
  ],

  "2": [ // Physics
    {
      id: 201,
      title: "Motion and Speed",
      content: [
        {
          id: "p1v1",
          type: "Video",
          title: "Concept of Motion",
          link: "https://www.youtube.com/watch?v=motion101",
          completed: true
        },
        {
          id: "p1a1",
          type: "Assignment",
          max_size: 5,
          file_type: "PDF",

          max_files: 5,

          title: "Speed Calculations",
          due: "July 22",
          dueDate: "2025-07-22",
          submitted: true,
          instructions: "Calculate speed from given data in the PDF worksheet.",
        }
      ]
    },
    {
      id: 202,
      title: "Energy and Work",
      content: [
        {
          id: "p2v1",
          type: "Video",
          title: "Understanding Work and Energy",
          link: "https://www.youtube.com/watch?v=energy101",
          completed: false
        },
        {
          id: "p2a1",
          type: "Assignment",
          max_size: 5,
          file_type: "PDF",

          max_files: 5,

          title: "Work-Energy Problems",
          due: "July 27",
          dueDate: "2025-07-27",
          submitted: false,
          instructions: "Answer the questions related to kinetic and potential energy.",
        }
      ]
    }
  ],

  "3": [ // Gujarati
    {
      id: 301,
      title: "Grammar Basics",
      content: [
        {
          id: "g1v1",
          type: "Video",
          title: "Gujarati Alphabets",
          link: "https://www.youtube.com/watch?v=gujaratialphabets",
          completed: true
        },
        {
          id: "g1a1",
          type: "Assignment",
          max_size: 5,
          file_type: "PDF",

          max_files: 5,

          title: "Write a Paragraph",
          due: "July 23",
          dueDate: "2025-07-23",
          submitted: false,
          instructions: "Write a paragraph using all types of sentence structures.",
        }
      ]
    },
    {
      id: 302,
      title: "Tenses in Gujarati",
      content: [
        {
          id: "g2v1",
          type: "Video",
          title: "Past and Present Tense",
          link: "https://www.youtube.com/watch?v=tensesgujarati",
          completed: false
        },
        {
          id: "g2a1",
          type: "Assignment",
          max_size: 5,
          file_type: "PDF",

          max_files: 5,

          title: "Tense Exercises",
          due: "July 26",
          dueDate: "2025-07-26",
          submitted: true,
          instructions: "Convert the given sentences into all three tenses.",
        }
      ]
    }
  ],

  "4": [ // Computer Science
    {
      id: 401,
      title: "Introduction to Computers",
      content: [
        {
          id: "c1v1",
          type: "Video",
          title: "What is a Computer?",
          link: "https://www.youtube.com/watch?v=computer101",
          completed: false
        },
        {
          id: "c1a1",
          type: "Assignment",
          max_size: 5,
          file_type: "PDF",

          max_files: 5,
          title: "Computer Hardware Assignment",
          due: "July 30",
          dueDate: "2025-07-30",
          submitted: false,
          instructions: "List basic input and output devices and explain their functions.",
        }
      ]
    },
    {
      id: 402,
      title: "Digital Logic",
      content: [
        {
          id: "c2v1",
          type: "Video",
          title: "Logic Gates Explained",
          link: "https://www.youtube.com/watch?v=logicgates",
          completed: false
        },
        {
          id: "c2a1",
          type: "Assignment",
          max_size: 5,
          file_type: "PDF",

          max_files: 5,

          title: "Truth Table Practice",
          due: "Aug 1",
          dueDate: "2025-08-01",
          submitted: false,
          instructions: "Create truth tables for AND, OR, and NOT gates.",
        }
      ]
    }
  ]
};
