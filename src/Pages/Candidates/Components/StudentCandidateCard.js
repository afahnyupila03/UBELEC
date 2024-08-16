import { Blockquote, Button, Card } from "flowbite-react";
import React from "react";
import { CardBody, CardFooter, CardHeader } from "react-bootstrap";

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
    <div className="font-sans my-4">
      <Card className="max-w-lg">
        <CardHeader>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            <Blockquote>{candidateName}</Blockquote>
          </h5>
        </CardHeader>
        <CardBody>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {candidateFaculty}
          </p>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {candidateDepartment}
          </p>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {candidatePosition}
          </p>
        </CardBody>
        <CardFooter>
          <Button
            color="success"
            type="button"
            onClick={voteHandler}
            disabled={isDisabled}
          >
            {isVoted ? "Voted" : "Vote Candidate"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
