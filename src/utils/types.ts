export type ProfileDataType = {
  individuId: string
  individuNomArabe: string
  individuNomLatin: string
  individuPrenomArabe: string
  individuPrenomLatin: string
  individuDateNaissance: string
  individuLieuNaissance: string
  individuLieuNaissanceArabe: string
  individuEmail: string
}

export type ApiResponseType = {
  success: boolean
  data: ProfileDataType | undefined
  error: string | undefined
}
