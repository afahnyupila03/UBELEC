UBEVOTE: Electronic Voting System
UBELEC is an electronic voting system designed to streamline the voting process for both administrators and students. This application enhances the voting experience by providing distinct roles for administrators and students, with features tailored to their specific needs.

Features
Admin Features
Candidate Management: Admins can add and remove candidates from the voting system for specific faculties and departments.
Vote Monitoring: Admins have the ability to view votes for all candidates in each campaign position, categorized by the students who voted.
Student Features
Account Creation: Students can create accounts with their email, password, faculty, department, and phone number.
Candidate Viewing: Students can view all candidates running for positions within their respective faculty and department.
Voting: Students can vote for one candidate in each campaign position.
Vote Confirmation: Once a vote is cast, it is final. Students cannot cancel or remove their vote.
Vote Review: Students can see the candidates they voted for in each position.
Installation
To set up the UBELEC system on your local machine:

Clone the Repository:

bash
Copy code
git clone https://github.com/afahnyupila03/UBELEC.git   
cd UBELEC
Install Dependencies:

bash
Copy code
npm install
Set Up Environment Variables:

Create a .env file in the root directory and add the necessary environment variables (e.g., Supabase credentials, API keys).
Start the Application:

bash
Copy code
npm start
Access the Application:

Open your browser and go to http://localhost:3000 to access the UBELEC voting system.
Technologies Used
Frontend
React
Flowbite (for UI components and styling)
Formik (for form management)
React Query (for data fetching and management)
Backend & Database
Supabase (handling backend services and authentication)
Supabase Postgres (for database management)
Database Schema
Below is an example schema for the UBELEC voting system:

Collection Fields
users:  user_id, email, password, faculty, department, phone
candidates	candidate_id, name, faculty, department, position
votes	vote_id, student_id, candidate_id, position, vote_type
Usage
Admin Role
Login: Access the admin dashboard using your credentials.
Manage Candidates: Add or remove candidates by selecting their faculty and department.
View Votes: Access detailed reports on the voting results for each campaign position.
Student Role
Sign Up: Create an account with your email, password, and other relevant details.
Login: Access the voting dashboard.
View Candidates: Browse candidates running for positions within your faculty and department.
Vote: Select one candidate per position and submit your vote. Note that once you vote, you cannot change or remove it.
Vote Review: Check the candidates you voted for in each position.
Contributions
Contributions to UBELEC are welcome! If you would like to contribute:

Fork the repository.
Create a new branch:
bash
Copy code
git checkout -b feature-branch
Make your changes.
Commit your changes:
bash
Copy code
git commit -m 'Add some feature'
Push to the branch:
bash
Copy code
git push origin feature-branch
Open a Pull Request.