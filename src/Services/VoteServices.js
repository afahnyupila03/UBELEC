import supabase from "../Configs/supabase";

export const StudentVotesServices = async (userId) => {
  try {
    const { data: studentVotes, error: studentError } = await supabase
      .from("VOTE_TABLE")
      .select(
        `
        vote_id,
        vote_type,
        vote_date,
        candidate_id,
        CANDIDATE_TABLE (
          candidate_name,
          candidate_faculty,
          candidate_department,
          candidate_position
        )
      `
      )
      .eq("user_id", userId);

    if (studentError) {
      console.error(`Error fetching student votes: ${studentError.message}`);
      throw new Error(`Error fetching student votes: ${studentError.message}`);
    }

    const studentVote = studentVotes.map((vote) => ({
      voteId: vote.vote_id,
      voteType: vote.vote_type,
      voteDate: vote.vote_date,
      candidateId: vote.candidate_id,
      candidateName: vote.CANDIDATE_TABLE.candidate_name,
      candidateFaculty: vote.CANDIDATE_TABLE.candidate_faculty,
      candidateDepartment: vote.CANDIDATE_TABLE.candidate_department,
      candidatePosition: vote.CANDIDATE_TABLE.candidate_position,
    }));

    return studentVote;
  } catch (error) {
    console.error("Error fetching student votes: ", error);
    throw new Error("Error fetching student votes: ", error);
  }
};

export const AdminVotesServices = async () => {
  try {
    const { data: adminVotes, error: adminError } = await supabase.from(
      "VOTE_TABLE"
    ).select(`
          vote_id,
          user_id,
          vote_type,
          vote_date,
          candidate_id,
          CANDIDATE_TABLE (
            candidate_name,
            candidate_faculty,
            candidate_department,
            candidate_position
          )
        `);

    if (adminError) {
      console.error(`Error fetching all votes: ${adminError.message}`);
      throw new Error(`Error fetching all votes: ${adminError.message}`);
    }

    // Aggregate votes by candidate and position, while retaining original vote data
    const voteCounts = {};
    const allVotes = adminVotes.map((vote) => {
      const candidateId = vote.candidate_id;

      // Initialize the candidate's vote count if it doesn't exist
      if (!voteCounts[candidateId]) {
        voteCounts[candidateId] = {
          candidateName: vote.CANDIDATE_TABLE.candidate_name,
          candidateFaculty: vote.CANDIDATE_TABLE.candidate_faculty,
          candidateDepartment: vote.CANDIDATE_TABLE.candidate_department,
          candidatePosition: vote.CANDIDATE_TABLE.candidate_position,
          voteCount: 0, // Start counting votes for this candidate
        };
      }

      // Increment the candidate's vote count
      voteCounts[candidateId].voteCount += 1;

      // Return the original vote details along with the aggregated vote count
      return {
        voteId: vote.vote_id,
        userId: vote.user_id,
        voteType: vote.vote_type,
        voteDate: vote.vote_date,
        candidateId,
        candidateName: vote.CANDIDATE_TABLE.candidate_name,
        candidateFaculty: vote.CANDIDATE_TABLE.candidate_faculty,
        candidateDepartment: vote.CANDIDATE_TABLE.candidate_department,
        candidatePosition: vote.CANDIDATE_TABLE.candidate_position,
        voteCount: voteCounts[candidateId].voteCount,
      };
    });

    return allVotes;
  } catch (error) {
    console.error("Error fetching all votes: ", error);
    throw new Error("Error fetching all votes: ", error);
  }
};
