import {
  Box,
  BreadcrumbGroup,
  ColumnLayout,
  Container,
  ContentLayout,
  CopyToClipboard,
  Header,
  SpaceBetween,
  StatusIndicator,
  Tabs,
  Textarea,
} from "@cloudscape-design/components";
import { APP_NAME } from "../../../common/constants";
import { useOnFollow } from "../../../common/hooks/use-on-follow";
import BaseAppLayout from "../../../components/base-app-layout";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import RouterButton from "../../../components/wrappers/router-button";
import { useCallback, useEffect, useState } from "react";
import { Utils } from "../../../common/utils";
import { ApiClient } from "../../../common/api-client/api-client";
import { Item } from "../../../common/types";

export default function ViewItemPage() {
  const onFollow = useOnFollow();
  const navigate = useNavigate();
  const { Name } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<Item | null>(null);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "main");
  const [value, setValue] = useState("");

  const getItem = useCallback(async () => {
    if (!Name) return;

    const apiClient = new ApiClient();
    const result = await apiClient.flows.getFlow(Name);


    console.log("result", result);

    if (!result) {
      navigate("/rag/workspaces");
      return;
    }

    setItem(result);
    setLoading(false);
  }, [navigate, Name]);

  useEffect(() => {
    getItem();
  }, [getItem]);

  return (
    <BaseAppLayout
      contentType="dashboard"
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
              text: item?.name || "",
              href: `/emx/items/${Name}`,
            },
          ]}
        />
      }
      content={
        <ContentLayout
          header={
            <Header
              variant="h1"
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <RouterButton data-testid="header-btn-view-details">
                    Delete
                  </RouterButton>
                </SpaceBetween>
              }
            >
              {loading ? (
                <StatusIndicator type="loading">Loading...</StatusIndicator>
              ) : (
                item?.name
              )}
            </Header>
          }
        >
          <SpaceBetween size="l">
            <Container header={<Header variant="h2">Item Settings</Header>}>
              <ColumnLayout columns={3} variant="text-grid">
                <SpaceBetween size="l">
                  <div>
                    <Box variant="awsui-key-label">Name</Box>
                    <div>{item?.Name ?? "loading..."}</div>
                  </div>
                  <div>
                    <Box variant="awsui-key-label">Availability Zone</Box>
                    <div>{item?.AvailabilityZone ?? "loading..."}</div>
                  </div>
                  <div>
                    <Box variant="awsui-key-label">EgressIp</Box>
                    <div>{item?.EgressIp ?? "loading..."}</div>
                  </div>
                  <div>
                    <Box variant="awsui-key-label">FlowArn</Box>
                    <div>
                    <CopyToClipboard
                      copyButtonAriaLabel="Copy ARN"
                      textToCopy={item?.FlowArn ?? "loading..."}
                      variant="inline"
                      />
                      </div>
                  </div>
                </SpaceBetween>
                <SpaceBetween size="l">
                  <div>
                    <Box variant="awsui-key-label">Source Name</Box>
                    <div>{item?.Source.Name ?? "loading..."}</div>                  </div>
                  <div>
                    <Box variant="awsui-key-label">Source Whitelist CIDR</Box>
                    <div>{item?.Source.WhitelistCidr ?? "loading..."}</div>
                  </div>
                  <div>
                    <Box variant="awsui-key-label">Source Protocol</Box>
                    <div>{item?.Source.Transport.Protocol ?? "loading..."}</div>
                  </div>
                  <div>
                    <Box variant="awsui-key-label">Source Max Bitrate</Box>
                    <div>{item?.Source.Transport.MaxBitrate ?? "loading..."}</div>
                  </div>
                </SpaceBetween>
                <SpaceBetween size="l">
                <div>
                    <Box variant="awsui-key-label">Souce Ingest IP</Box>
                    <div>{item?.Source.IngestIp ?? "loading..."}</div>
                  </div>
                  <div>
                    <Box variant="awsui-key-label">Souce Ingest Port</Box>
                    <div>{item?.Source.IngestPort ?? "loading..."}</div>
                  </div>
                  <div>
                    <Box variant="awsui-key-label">Source ARN</Box>
                    <CopyToClipboard
                      copyButtonAriaLabel="Copy ARN"
                      textToCopy={item?.Source.SourceArn ?? "loading..."}
                      variant="inline"
                      />
                      </div>
                  <div>
                    <Box variant="awsui-key-label">Entitlements</Box>
                    <div>{item?.Entitlements ?? "loading..."}</div>
                  </div>
                </SpaceBetween>
              </ColumnLayout>
            </Container>
            <Tabs
              tabs={[
                {
                  label: "Main",
                  id: "main",
                  content: (
                    <Container>
                      <SpaceBetween size="l">
                        <Header
                          variant="h2"
                          actions={<RouterButton>Manage</RouterButton>}
                        >
                          Main
                        </Header>
                        <Textarea
                          onChange={({ detail }) => setValue(detail.value)}
                          value={value}
                          placeholder="This is a placeholder"
                        />
                      </SpaceBetween>
                    </Container>
                  ),
                },
                {
                  label: "Additional",
                  id: "additional",
                  content: <Container>Additional Tab</Container>,
                },
              ]}
              activeTabId={activeTab}
              onChange={({ detail: { activeTabId } }) => {
                setActiveTab(activeTabId);
                setSearchParams((current) => ({
                  ...Utils.urlSearchParamsToRecord(current),
                  tab: activeTabId,
                }));
              }}
            />
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
