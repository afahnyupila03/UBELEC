import supabase from "../Configs/supabase";

export const fetchAdminProfiles = async (adminId) => {
  try {
    // Fetch the admin profile from the database
    const { data: adminData, error: adminError } = await supabase
      .from("ADMIN_TABLE")
      .select(
        `
        admin_id,
        first_name,
        last_name,
        email,
        phone,
        faculty_name,
        department_name,
        created_at
        `
      )
      .eq("admin_id", adminId)
      .single(); // Ensure that only a single record is returned

    // Throw an error if the query fails
    if (adminError) throw adminError;

    // Format the admin profile data
    const adminProfile = {
      id: adminData.admin_id,
      name: `${adminData.first_name} ${adminData.last_name}`,
      email: adminData.email,
      phone: adminData.phone,
      faculty: adminData.faculty_name,
      department: adminData.department_name,
      created_at: adminData.created_at,
    };

    return adminProfile;
  } catch (error) {
    console.error("Error fetching admin profile: ", error);
    throw new Error(`Failed to fetch admin profile: ${error.message}`);
  }
};


export const fetchUserProfile = async (userId) => {
  try {
    const { data: userData, error: userError } = await supabase
      .from("USER_TABLE")
      .select(
        `
        user_id,
        first_name,
        last_name,
        email,
        phone,
        faculty_name,
        department_name,
        created_at
        `
      )
      .eq("user_id", userId)
      .single();

    if (userError) throw userError;

    const userProfile = {
      id: userData.user_id,
      name: `${userData.first_name} ${userData.last_name}`,
      email: userData.email,
      phone: userData.phone,
      faculty: userData.faculty_name,
      department: userData.department_name,
      created_at: userData.created_at,
    };

    return userProfile;
  } catch (error) {
    console.error("Error fetching user profile: ", error);
    throw error;
  }
};
