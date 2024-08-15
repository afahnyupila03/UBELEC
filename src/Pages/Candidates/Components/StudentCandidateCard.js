import React from "react";

export default function StudentCandidateCard({
  voteHandler,
  candidateData,
  isVoted,
  isDisabled,
}) {
  const {
    candidateName,
    candidateDepartment,
    candidateFaculty,
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
        <button type="button" onClick={voteHandler} disabled={isDisabled}>
          {isVoted ? "Voted" : "Vote Candidate"}
        </button>
      </div>
    </div>
  );
}
