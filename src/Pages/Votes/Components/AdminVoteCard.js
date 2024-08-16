export default function AdminVoteCard({ voteData }) {
  const {
    voteType,
    candidateId,
    candidateName,
    candidateFaculty,
    candidateDepartment,
    voteCount,
  } = voteData;
  return (
    <div key={candidateId}>
      <div>
        <h3>{candidateName}</h3>
        <p>{candidateFaculty}</p>
        <p>{candidateDepartment}</p>
      </div>
      <hr />
      <div>
        <div>
          <p>{voteType}</p>
        </div>
        <div>Vote count: ({voteCount})</div>
      </div>
    </div>
  );
}
