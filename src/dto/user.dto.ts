import { Category, Product } from "@prisma/client";

export interface CreateUserDTO {
    name: string;
    email: string;
}

export interface IProductWithCategory {
    product: Product;
    category: Category;
}


// // UseEmainDTO.ts

// export default class UserDTO {
//     emailTo: string;
//     emailFrom: string;
//     subject?: string;

//     constructor(emailTo: string | undefined, emailFrom: string | undefined, subject?: string) {
//         if (!emailTo || !emailFrom) {
//             throw new Error('EmailTo and EmailFrom are required');
//         }
//         this.emailTo = emailTo;
//         this.emailFrom = emailFrom;
//         this.subject = subject || '';
//     }
// }

// export default class CreateUserDTO {
