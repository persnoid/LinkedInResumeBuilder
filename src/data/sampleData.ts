import { ResumeData } from '../types/resume';

export const sampleResumeData: ResumeData = {
  personalInfo: {
    name: 'John Doe',
    title: 'Senior Software Engineer',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'johndoe.dev',
    linkedin: 'linkedin.com/in/johndoe'
  },
  summary: 'Experienced software engineer with 8+ years of expertise in full-stack development, cloud architecture, and team leadership. Proven track record of delivering scalable solutions and mentoring junior developers.',
  experience: [
    {
      id: '1',
      position: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      startDate: '2020-03',
      endDate: '2024-12',
      current: true,
      description: [
        'Led development of microservices architecture serving 10M+ users',
        'Mentored team of 5 junior developers and improved team productivity by 40%',
        'Implemented CI/CD pipelines reducing deployment time by 60%'
      ]
    },
    {
      id: '2',
      position: 'Software Engineer',
      company: 'StartupXYZ',
      location: 'San Francisco, CA',
      startDate: '2018-01',
      endDate: '2020-02',
      current: false,
      description: [
        'Built and maintained React-based web applications',
        'Developed RESTful APIs using Node.js and Express',
        'Collaborated with design team to implement pixel-perfect UIs'
      ]
    }
  ],
  education: [
    {
      id: '1',
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      startDate: '2014-09',
      endDate: '2018-05',
      gpa: '3.8',
      description: 'Relevant Coursework: Data Structures, Algorithms, Software Engineering'
    }
  ],
  skills: [
    { id: '1', name: 'JavaScript', level: 'Expert' },
    { id: '2', name: 'React', level: 'Expert' },
    { id: '3', name: 'Node.js', level: 'Advanced' },
    { id: '4', name: 'Python', level: 'Advanced' },
    { id: '5', name: 'AWS', level: 'Intermediate' },
    { id: '6', name: 'Docker', level: 'Intermediate' }
  ],
  languages: [
    { id: '1', name: 'English', level: 'Fluent' },
    { id: '2', name: 'German', level: 'Intermediate' }
  ],
  certifications: [
    {
      id: '1',
      name: 'AWS Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2023-06',
      url: 'https://aws.amazon.com/certification/'
    }
  ]
};