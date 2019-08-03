import * as React from "react";

import { Section, MainPanel } from "../components/layout";
import { CampaignServiceContainer } from "../containers/campaign";
import { RouteComponentProps } from "react-router-dom";
import { routeToCharacterSheet, routeToCharacterSelection, CampaignRouteParams } from "../services/routes";

export function RootPage({ match, history }: RouteComponentProps<CampaignRouteParams>) {
    const campaignService = CampaignServiceContainer.useContainer();
    const { campaignKey } = match.params;
    const campaignEntry = campaignService.campaigns[campaignKey];
    const campaign = campaignEntry.data;
    const initialCharacter = campaign.lastUsedCharacter;

    if (initialCharacter) {
        history.push(routeToCharacterSheet({ campaignKey, characterKey: initialCharacter }))
    } else {
        history.push(routeToCharacterSelection({ campaignKey }));
    }

    return <MainPanel>
        <Section title="Campaign">
            {campaign.name}
        </Section>
    </MainPanel>;
}