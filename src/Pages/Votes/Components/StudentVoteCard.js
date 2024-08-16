import { Blockquote, Button, Card } from "flowbite-react";
import React from "react";
import { CardBody, CardFooter, CardHeader } from "react-bootstrap";

export default function StudentVoteCard({ voteData }) {
  const {
    candidateName,
    candidateFaculty,
    candidateDepartment,
    voteDate,
    voteType,
  } = voteData;
  return (
    <div className="font-sans my-4">
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
            Date of vote: {voteDate}
          </Blockquote>
        </CardBody>
        <hr />
        <CardFooter>
          <Button color="success" type="button" disabled={true}>
            Voted
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
