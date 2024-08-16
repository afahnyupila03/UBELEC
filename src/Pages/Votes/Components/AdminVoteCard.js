import { Blockquote, Card } from "flowbite-react";
import React from "react";
import { CardBody, CardHeader } from "react-bootstrap";

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
    <div className="font-sans my-4" key={candidateId}>
      <Card>
        <CardHeader>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            <Blockquote>{candidateName}</Blockquote>
          </h5>
        </CardHeader>
        <hr />
        <CardBody>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {candidateFaculty}
          </p>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {candidateDepartment}
          </p>
          <hr />
          <Blockquote className="font-normal text-gray-700 dark:text-gray-400">
            {voteType}
          </Blockquote>
          <Blockquote className="font-normal text-gray-700 dark:text-gray-400">
            Vote count: ({voteCount})
          </Blockquote>
        </CardBody>
      </Card>
    </div>
  );
}
