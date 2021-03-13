import { LightningElement, api, wire } from 'lwc';
import getSimilarBoats from '@salesforce/apex/BoatDataService.getSimilarBoats';
import { NavigationMixin} from 'lightning/navigation';

export default class SimilarBoats extends NavigationMixin(LightningElement) {
    currentBoat;
    boatId;
    relatedBoats;
    error;

    @api
    get recordId(){
        return this.boatId;
    }
    set recordId(value){
        this.setAttribute('boatId',value);
        this.boatId = value;
    }

    @api
    similarBy;

    @wire(getSimilarBoats , {boatId : '$boatId' , similarBy : '$similarBy'}) similarBoats({error,data}){
        if(data){
            this.relatedBoats = data;
            this.error = undefined;
        }else if(error){
            this.error = error;
            this.relatedBoats = undefined;
        }
    };
    get getTitle() {
        return 'Similar boats by ' + this.similarBy;
      }
    get noBoats(){
        return !(this.relatedBoats && this.relatedBoats.length > 0);
    }

    openBoatDetailPage(event){
        let selectedBoatId = event.detail.boatId;
        this[NavigationMixin.Navigate]({
            type : 'standard__recordPage',
            attributes : {
                recordId : selectedBoatId,
                actionName : 'view'
            }
        });
    }

}