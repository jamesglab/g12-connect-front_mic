export const EditProfileMock = (
  form_user: any,
  form_contact_information: any
) => {
  return {
    id: form_user.id,
    verify: form_user?.verify,
    is_leader: form_user?.is_leader,
    document_type: form_user?.document_type,
    identification: form_user?.identification,
    name: form_user?.name,
    last_name: form_user?.last_name,
    gender: form_user?.gender,
    phone: form_contact_information?.phone,
    birth_date: new Date(form_user?.birth_date),
    studies_level: form_user.studies_level.value,
    profession: form_user?.profession,
    current_occupation: form_user?.current_occupation,
    other_study: form_user?.other_study,
    address: form_contact_information?.address,
    email: form_contact_information?.email,
    password: form_contact_information?.password,
  };
};
