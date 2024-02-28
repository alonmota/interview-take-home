import { FormSchema, formSchema } from '@/common/types/form-data';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  PageActions,
  TextField,
} from '@shopify/polaris';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { z } from 'zod';

const AUTH_TOKEN = 'fake-user-1-token';

export default function Home() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(['user'], async () => {
    const response = await fetch('/api/user', {
      headers: {
        Authorization: `Basic ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();

    return data;
  });

  const { mutateAsync: updateUser, isLoading: isUserUpdating } = useMutation(
    async ({ email, name }: { email: string; name: string }) => {
      const response = await fetch('/api/user', {
        headers: {
          Authorization: `Basic ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify({ email, name }),
      });
      const data = await response.json();

      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user');
      },
    },
  );

	const { 
		control,
		handleSubmit, 
		formState: { errors },
		setValue
	 } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
  });


  async function onSubmit(data: FormSchema) {
    await updateUser(data);
  };

  useEffect(() => {
    if (!isLoading) {
			setValue("name", data?.user.name || '')
			setValue("email", data?.user.email || '')
    }
  }, [isLoading, data, setValue]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Page title="Home">
        <Layout>
          <Layout.AnnotatedSection
            title="Account details"
            description="Abra will use this as your account information."
          >
            <Card>
              <FormLayout>

								<Controller
									control={control}
									name="name"
									render={({ field: { onChange, value } }) => (
										<TextField
											label="Full name"
											autoComplete="name"
											onChange={onChange}
											value={value}
											error={errors?.name?.message}
										/>
									)}
								/>
								<Controller
									control={control}
									name="email"
									render={({ field: { onChange, value } }) => (
										<TextField
											type="email"
											label="Email"
											autoComplete="email"
											onChange={onChange}
											value={value}
											error={errors?.email?.message}
										/>
									)}
								/>
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
        </Layout>
        <PageActions
          primaryAction={
            <Button
              submit
              variant="primary"
              loading={isUserUpdating}
              disabled={isUserUpdating || isLoading}
            >
              Save
            </Button>
          }
        />
      </Page>
    </Form>
  );
}
