import {NextPage} from "next";
import {BaseLayout} from "@ui";


const Onramper: NextPage = ()=>{
    return (<BaseLayout>
        <div style={{display: 'flex', justifyContent: 'center', padding: '15px'}}>
            <iframe
                style={{borderRadius: '10px', boxShadow: '0 2px 10px 0 rgba(0,0,0,.20)', margin: 'auto', maxWidth: '420px'}}
                src="https://widget.onramper.com?color=266677&apiKey=pk_test_LY7BSnJawcHyCsemFl_pqm1VzY83hv0GQTp4yub0J7E0"
                height="660px"
                width="482px"
                title="Onramper widget"
                frameBorder="0"
                allow="accelerometer; autoplay; camera; gyroscope; payment"
            >
            </iframe>
        </div>
    </BaseLayout>)
}

export default Onramper