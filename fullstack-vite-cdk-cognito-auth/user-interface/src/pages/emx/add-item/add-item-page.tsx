import {
  BreadcrumbGroup,
  Button,
  Container,
  ContentLayout,
  Form,
  FormField,
  Header,
  Input,
  SpaceBetween,
} from "@cloudscape-design/components";
import { useState } from "react";
import { APP_NAME } from "../../../common/constants";
import { useOnFollow } from "../../../common/hooks/use-on-follow";
import { useForm } from "../../../common/hooks/use-form";
import { Item } from "../../../common/types";
import { ApiClient } from "../../../common/api-client/api-client";
import BaseAppLayout from "../../../components/base-app-layout";
import RouterButton from "../../../components/wrappers/router-button";
import { useNavigate } from "react-router-dom";

const nameRegex = /^[\w+_-]+$/;

const defaults: Omit<Item, "itemId"> = {
  name: "",
  status: "success",
  type: "Items",
  details: 0,
  port: "",
  Name: "",
  Status: "",
  Description: "",
  AvailabilityZone: ""
};

export default function AddItemPage() {
  const onFollow = useOnFollow();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | undefined>(undefined);

  const { data, onChange, errors, validate } = useForm({
    initialValue: () => ({
      ...defaults,
    }),
    validate: (form) => {
      const errors: Record<string, string | string[]> = {};
      const name = form.name.trim();

      if (name.trim().length === 0) {
        errors.name = "Name is required";
      } else if (name.trim().length > 100) {
        errors.name = "Name must be less than 100 characters";
      } else if (!nameRegex.test(name)) {
        errors.name =
          "Name can only contain letters, numbers, underscores, and dashes";
      }

      return errors;
    },
  });

  const submitForm = async () => {
    if (!validate()) return;

    setGlobalError(undefined);
    setSubmitting(true);

    const apiClient = new ApiClient();
    // const result = await apiClient.items.addItem({
    //   name: data.name.trim(),
    //   status: data.status,
    //   type: data.type,
    //   details: data.details,
    // });

    const result = await apiClient.outputs.addOutput({
      name: data.name.trim(),
      status: data.status,
      type: data.type,
      details: data.details,
      port: data.port,
    });

    if (result) {
      navigate("/emx");
      return;
    }

    setSubmitting(false);
    setGlobalError("Something went wrong");
  };

  return (
    <BaseAppLayout
      breadcrumbs={
        <BreadcrumbGroup
          onFollow={onFollow}
          items={[
            {
              text: APP_NAME,
              href: "/",
            },
            {
              text: "Items",
              href: "/emx",
            },
            {
              text: "Add Output",
              href: "/emx/add",
            },
          ]}
          expandAriaLabel="Show path"
          ariaLabel="Breadcrumbs"
        />
      }
      content={
        <ContentLayout
          header={
            <Header variant="h1" description="Add a new output to the MediaConnect Flow">
              Add Output
            </Header>
          }
        >
          <form onSubmit={(event) => event.preventDefault()}>
            <Form
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <RouterButton variant="link" href="/emx">
                    Cancel
                  </RouterButton>
                  <Button
                    data-testid="create"
                    variant="primary"
                    onClick={submitForm}
                    disabled={submitting}
                  >
                    Add Output
                  </Button>
                </SpaceBetween>
              }
              errorText={globalError}
            >
              <Container
                header={<Header variant="h2">Output Configuration</Header>}
              >
                <SpaceBetween size="l">
                  <FormField label="Name" errorText={errors.name}>
                    <Input
                      placeholder="Output Name"
                      disabled={submitting}
                      value={data.name}
                      onChange={({ detail: { value } }) =>
                        onChange({ name: value })
                      }
                    />
                  </FormField>
                  <FormField label="Port" errorText={errors.port}>
                    <Input
                      placeholder="2000 - 3000"
                      disabled={submitting}
                      value={data.port}
                      onChange={({ detail: { value } }) =>
                        onChange({ port: value })
                      }
                    />
                  </FormField>
                </SpaceBetween>
              </Container>
            </Form>
          </form>
        </ContentLayout>
      }
    />
  );
}
