import * as React from "react";
import { Link } from "react-router-dom";
import { History } from "history";

import { Section, MainPanel } from "../components/layout";
import { CampaignServiceContainer } from "../containers/campaign";
import { EntryItem, Label, TextInput } from "../components/controls";
import { Campaign } from "../contracts/campaign";
import { KeyEntry } from "../contracts/persistence";
import { campaignRoute } from "../services/routes";
import { PrimaryButton } from "../components/buttons";

export function CampaignSelection({ history }: { history: History }) {
    const campaignService = CampaignServiceContainer.useContainer();
    function onClick(c: KeyEntry<Campaign>) {
        history.push(campaignRoute.to({campaignKey: c.key}));
    }

    return <MainPanel>
        <Section title="Campaign selection">
            <div className="flex">
                <div className="flex-grow p-4">
                    Select a campaign...
                    {Object.values(campaignService.campaigns).map((c) => {
                        const route = campaignRoute.to({campaignKey: c.key});
                        return <Link to={route} key={c.key}>
                            <EntryItem entry={c} />
                        </Link>
                    })}
                </div>
                <div className="flex-grow p-4">
                    ... or create a new one.
                    <CampaignForm onSubmit={(c) => onClick(c)} />
                </div>
            </div>
        </Section>
    </MainPanel>;
}

function CampaignForm({ onSubmit }: { onSubmit: (c: KeyEntry<Campaign>) => void }) {
    const campaignService = CampaignServiceContainer.useContainer();
    const [name, setName] = React.useState("");

    return <div>
        <div className="mb-4">
            <Label>Name</Label>
            <TextInput value={name} onChange={setName} />
        </div>
        <div className="text-right">
            <PrimaryButton onClick={() => onSubmit(campaignService.createCampaign(name))}>Ok</PrimaryButton>
        </div>
    </div>
}