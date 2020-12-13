interface ITemplateVariables {
  [key: string]: string | number;
}

export default interface IPaserMailTemplateDTO {
  templateFile: string;
  variables: ITemplateVariables;
}
