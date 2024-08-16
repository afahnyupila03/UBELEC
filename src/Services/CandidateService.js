import supabase from "../Configs/supabase";

export const fetchCandidateProfiles = async () => {
  try {
    const { data: candidateProfiles, error } = await supabase
      .from("CANDIDATE_TABLE")
      .select("*");

    if (error) throw error;

    const candidates = [];
    for (const key in candidateProfiles) {
      if (candidateProfiles.hasOwnProperty(key)) {
        candidates.push({
          candidateId: candidateProfiles[key].candidate_id,
          candidateName: candidateProfiles[key].candidate_name,
          candidateFaculty: candidateProfiles[key].candidate_faculty,
          candidateDepartment: candidateProfiles[key].candidate_department,
          candidatePosition: candidateProfiles[key].candidate_position,
        });
      }
    }
    return candidates;
  } catch (error) {
    console.error("Error fetching admin profile: ", error);
    throw new Error(`Failed to fetch admin profile: ${error.message}`);
  }
};
