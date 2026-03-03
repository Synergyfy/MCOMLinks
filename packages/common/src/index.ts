export class Link {
  id!: string;
  url!: string;
  title!: string;
  description?: string;
  createdAt!: Date;
}

export class CreateLinkDto {
  url!: string;
  title!: string;
  description?: string;
}
