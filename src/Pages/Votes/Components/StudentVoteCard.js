export default function StudentVoteCard({ voteData }) {
  const {
    candidateName,
    candidateFaculty,
    candidateDepartment,
    voteDate,
    voteTye,
  } = voteData;
  return (
    <div>
      <div>
        <h1>{candidateName}</h1>
        <p>{candidateFaculty}</p>
        <p>{candidateDepartment}</p>
      </div>
      <hr />
      <div>
        <div>
          <p>{voteTye}</p>
        </div>
        <div>
          <p>Date of vote: {voteDate}</p>
        </div>
      </div>
    </div>
  );
}
