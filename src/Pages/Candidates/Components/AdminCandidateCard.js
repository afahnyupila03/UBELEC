import React from "react";

export default function AdminCandidateCard({ removeCandidate, candidateData }) {
  const {
    candidateName,
    candidateFaculty,
    candidateDepartment,
    candidatePosition,
  } = candidateData;
  return (
    <div>
      <div>
        <p>Candidate Name: {candidateName}</p>
        <p>Candidate Faculty: {candidateFaculty}</p>
        <p>Candidate Department: {candidateDepartment}</p>
      </div>
      <hr />
      <div>
        <p>Campaign Position: {candidatePosition}</p>
      </div>
      <div>
        <button type="button" onClick={removeCandidate}>
          Remove Candidate
        </button>
      </div>
    </div>
  );
}
