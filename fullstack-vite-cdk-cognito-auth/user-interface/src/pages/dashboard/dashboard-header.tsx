import { Header, SpaceBetween } from "@cloudscape-design/components";
import RouterButton from "../../components/wrappers/router-button";
import RouterButtonDropdown from "../../components/wrappers/router-button-dropdown";

export default function DashboardHeader() {
  return (
    <Header
      variant="h1"
      actions={
        <SpaceBetween direction="horizontal" size="xs">
          <RouterButton href="/emx">View Flows</RouterButton>
          <RouterButtonDropdown
            items={[
              {
                id: "add-data",
                text: "Add Item",
                href: "/emx/add",
              },
            ]}
          >
            Add data
          </RouterButtonDropdown>
        </SpaceBetween>
      }
    >
      Dashboard
    </Header>
  );
}
