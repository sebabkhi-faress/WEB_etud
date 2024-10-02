export type ProfileDataType = {
  individuId: number
  nin: string
  individuNomArabe: string
  individuNomLatin: string
  individuPrenomArabe: string
  individuPrenomLatin: string
  individuDateNaissance: string
  individuLieuNaissance: string
  individuLieuNaissanceArabe: string
  llEtablissementArabe: string
  llEtablissementLatin: string
  niveauLibelleLongLt: string
  ofLlDomaine: string
  ofLlSpecialite: string
}

export type ApiResponseType = {
  success: boolean
  data: ProfileDataType | undefined
  error: string | undefined
}
