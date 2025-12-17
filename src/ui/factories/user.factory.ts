import { SignUpModel } from '@_ui/models/sign-up.model';
import { faker } from '@faker-js/faker/locale/en';

export function prepareRandomUser(): SignUpModel {
  const name = faker.person.firstName().replace(/[^A-Za-z]/g, '');
  const password = faker.internet.password({ length: 8 });

  return {
    name: name,
    email: faker.internet.email({ firstName: name }),
    password: password,
    confirmPassword: password,
  };
}
