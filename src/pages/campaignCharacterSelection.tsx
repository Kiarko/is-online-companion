import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import { Section, MainPanel } from "../components/layout";
import { Select, Label, TextInput, Button, EntryItem } from "../components/controls";
import { CampaignServiceContainer } from "../containers/campaign";
import { DataServiceContainer } from "../containers/dataService";
import { Character } from "../contracts/character";
import { KeyEntry } from "../contracts/persistence";
import { routeToCampaignCharacter, CampaignCharacterSelectionRouteParams } from "../services/routes";
import { useLens } from "../services/functors";
import { makeDefaultCharacter } from "../services/characterHelpers";

export function CampaignCharacterSelection({ match, history }: RouteComponentProps<CampaignCharacterSelectionRouteParams>) {
    const campaignService = CampaignServiceContainer.useContainer();
    const dataService = DataServiceContainer.useContainer();
    const { campaignKey } = match.params;
    const campaignEntry = campaignService.campaigns[campaignKey];
    const campaign = campaignEntry.data;

    function onCharacterSelected(selectedChar: KeyEntry<Character>) {
        campaignService.addCharacter(campaignKey, selectedChar.key);
        history.push(routeToCampaignCharacter({ campaignKey, characterKey: selectedChar.key }))
    }

    const characters = Array.from(campaign.characters).map((c) => dataService.characters.values[c]);

    return <MainPanel>
        <Section title="Character selection">
            <div className="flex">
                <div className="flex-grow mr-4">
                    Select a character...
                <CharacterPicker characters={characters} onSelected={onCharacterSelected} />
                </div>
                <div className="flex-grow">
                    ... or create a new one.
                <CharacterForm onCreated={onCharacterSelected} />
                </div>
            </div>
        </Section>
    </MainPanel>;
}

function CharacterForm({ onCreated }: { onCreated: (c: KeyEntry<Character>) => void }) {
    const dataService = DataServiceContainer.useContainer();
    const { state: character, zoom } = useLens(makeDefaultCharacter())
    const statOptions = [0, 1, 2, 3].map(i => ({ name: i.toString(), value: i }));
    const statLens = zoom("stats");
    const { state: name, setState: setName } = zoom("name");

    function onSubmit() {
        const entry = dataService.characters.saveNew(character);
        onCreated(entry);
    }

    return <div>
        <div className="my-2">
            <Label>Name</Label>
            <TextInput
                value={name}
                onChange={(name) => setName(() => name)}
            />
            <div className="flex flex-wrap justify-around my-2">
                {Object.keys(character.stats).map((key) => {
                    const tkey = key as keyof typeof character.stats;
                    const { state: value, setState: setValue } = statLens.zoom(tkey);
                    return <div className="mr-2 mt-3 flex flex-col items-center" key={key}>
                        <Select
                            options={statOptions}
                            value={value}
                            onSelect={(v) => setValue(() => v)}
                        />
                        <Label>{key}</Label>
                    </div>
                })}
            </div>
        </div>
        <div className="text-right">
            <Button onClick={onSubmit}>Ok</Button>
        </div>
    </div>
}

interface CharacterSelectionProps {
    characters: KeyEntry<Character>[];
    onSelected: (character: KeyEntry<Character>) => void;
}

function CharacterPicker({ characters, onSelected }: CharacterSelectionProps) {
    return characters.length ?
        <ul>
            {characters.map((c) => {
                return <div className="cursor-pointer" onClick={() => onSelected(c)} key={c.key}>
                    <EntryItem entry={c} />
                </div>
            })}
        </ul> :
        <div className="w-full p-8 border-dashed border-2 text-center text-gray-500 border-gray-500">
            Nothing to select
        </div>
}
