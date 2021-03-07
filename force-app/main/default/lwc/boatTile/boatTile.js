import { LightningElement, api } from 'lwc';
const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
const TILE_WRAPPER_UNSELECTED_CLASS = 'tile-wrapper';

export default class BoatTile extends LightningElement {

    @api boat;
    @api selectedBoatId;

    selectBoat() {
        this.selectedBoatId = !this.selectedBoatId;
        const boatselect = new CustomEvent("boatselect", {
            detail: {
                boatId: this.boat.Id
            }
        });
        this.dispatchEvent(boatselect);
    }
    get tileClass() {
        return this.selectedBoatId === this.boat.Id ? TILE_WRAPPER_SELECTED_CLASS : TILE_WRAPPER_UNSELECTED_CLASS;
    }

    get backgroundStyle() {
        return 'background-image:url(' + this.boat.Picture__c + ')';
    }
}