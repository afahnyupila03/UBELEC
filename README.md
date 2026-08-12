UBELEC — Electronic Voting System

A full electronic voting system designed for universities, allowing secure voting, candidate management, and real-time vote monitoring for both admins and students.
Built to streamline campus elections and reduce manual errors.

---

🚀 Features

Admin

Candidate Management — Add/remove candidates by faculty & department

Vote Monitoring — View vote counts per position

Campaign Position Overview — See who received votes and from which students

Student

Account Creation with email, password, faculty, department & phone

Candidate Viewing filtered by faculty/department

Secure Voting — One vote per position, final once submitted

Vote Review — View selected candidates for each role
---

🛠️ Tech Stack

Frontend

React
Tailwind / Flowbite
Formik
React Query

Backend / Database
Supabase
Supabase Postgres

---

📦 Installation

git clone https://github.com/afahnyupila03/UBELEC.git
cd UBELEC
npm install

Environment Variables

Create a .env file in the root directory and add your Supabase credentials:

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

Start the App

npm start

Open: http://localhost:3000
---

🗂️ Database Schema (Simplified)

users

Field	Description

user_id	Primary key
email	Student email
password	Hashed password
faculty	Student faculty
department	Student department
phone	Phone number


candidates

Field	Description

candidate_id	Primary key
name	Candidate name
faculty	Faculty
department	Department
position	Campaign position

votes

Field	Description

vote_id	Primary key
student_id	Reference to user
candidate_id	Reference to candidate
position	Position voted for
vote_type	Type of vote (if applicable)

---

📘 Usage

Admin
1. Log in
2. Manage candidates
3. View detailed vote results

Student
1. Sign up & log in
2. View candidates
3. Vote once per position
4. Review your selections
---

## 🌐 Live Demo
https://ubelec-edlu3zag3-afahnyupila03s-projects.vercel.app

🤝 Contributions

Contributions are welcome.

git checkout -b feature-branch
# make changes
git commit -m "Add feature"
git push origin feature-branch

Then open a Pull Request.
---

📨 Contact

If you want to collaborate or discuss improvements:
Email: fulopila9@gmail.com
