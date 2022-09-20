import { Check, GameController } from "phosphor-react";
import { Input } from "./Form/Input";
import * as Dialog from '@radix-ui/react-dialog';
import * as Checkbox from '@radix-ui/react-checkbox';
import {useState, useEffect, FormEvent} from "react";
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import  axios  from "axios";

interface Game {
    id: string,
    bannerUrl?: string,
    title: string,
    _count?: {
      ads: number
    }
  }

export function CreateAdModal(){
    const [ games, setGames ] = useState<Game[]>([]);

    useEffect( () => {
                  axios('http://localhost:3333/games').then( response => { setGames(response.data)} ) } 
             , []);
    
    const [weekDays, setWeekDays] = useState<string[]>([]);

    function handleCreateAd(event:FormEvent){
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const data = Object.fromEntries(formData);

        console.log(data);
        console.log(weekDays);
        console.log(voiceChannel);
        console.log(`http://localhost:3333/games/${data.game}/ads`);

        if(!data.nome){
            return;
        }

        try {
            axios.post(`http://localhost:3333/games/${data.game}/ads`, {
                name: data.nome,
                weekDays:weekDays.map(Number),
                discord: data.discord,
                useVoiceChannel: voiceChannel,
                yearsPlaying: Number(data.yearsPlaying),
                hourEnd: data.hourEnd,
                hourStart: data.hourStart
            });
            alert("Anúncio criado com sucesso!");
        } catch(err) {
            console.log(err);
            alert("Erro ao criar o anúncio");
        }
}

    const [voiceChannel, setVoiceChannel] = useState(false);

    return (
        <Dialog.Portal>
            <Dialog.Overlay className="bg-black/50 inset-0 fixed" />
            <Dialog.Content className="bg-[#2A2634] fixed py-8 px-10 text-white top-1/2 left-1/2 
                                            -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] 
                                                shadow-lg shadow-black/25">
                <Dialog.Title className="text-3xl font-black">Publique um Anúncio</Dialog.Title>

                <form className="mt-8 flex flex-col gap-4" onSubmit={handleCreateAd}>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="game" className="font-semibold">Qual o game?</label>
                        <select name="game" id="game" className="bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500 appearance-none" defaultValue="" >
                            <option disabled value="">Selecione o game que deseja jogar</option>
                            { games.map(game => {
                                return (
                                    <option key={game.id} value={game.id}>{game.title}</option>
                                )
                            }) }
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="nome">Seu nome (ou nickname)</label>
                        <Input name="nome" id="nome" type="text" placeholder="Como te chamam dentro do game" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="yearsPlaying">Joga há quanto tempo?</label>
                            <Input name="yearsPlaying" id="yearsPlaying" type="number" placeholder="Tudo bem ser ZERO" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="discord">Qual o seu discord?</label>
                            <Input name="discord" id="discord" type="text" placeholder="Usuario#000000" />
                        </div>
                    </div>

                    <div className="flex flex-row gap-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="weekDays">Quando costuma jogar?</label>
                            <ToggleGroup.Root type="multiple" className="grid grid-cols-4 gap-2" onValueChange={setWeekDays} value={weekDays}>
                                <ToggleGroup.Item value="0" title="Domingo" className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('0') ? 'bg-violet-500' : ''}`}>D</ToggleGroup.Item>
                                <ToggleGroup.Item value="1" title="Segunda" className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('1') ? 'bg-violet-500' : ''}`}>S</ToggleGroup.Item>
                                <ToggleGroup.Item value="2" title="Terça" className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('2') ? 'bg-violet-500' : ''}`}>T</ToggleGroup.Item>
                                <ToggleGroup.Item value="3" title="Quarta" className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('3') ? 'bg-violet-500' : ''}`}>Q</ToggleGroup.Item>
                                <ToggleGroup.Item value="4" title="Quinta" className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('4') ? 'bg-violet-500' : ''}`}>Q</ToggleGroup.Item>
                                <ToggleGroup.Item value="5" title="Sexta" className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('5') ? 'bg-violet-500' : ''}`}>S</ToggleGroup.Item>
                                <ToggleGroup.Item value="6" title="Sábado" className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('6') ? 'bg-violet-500' : ''}`}>S</ToggleGroup.Item>
                            </ToggleGroup.Root>
                        </div>

                        <div  className="flex flex-col gap-2 flex-1">
                            <label htmlFor="hourStart">Qual horário do dia?</label>
                            <div className="grid grid-cols-2 gap-2">
                                <Input name="hourStart" id="hourStart" type="time" placeholder="De" />
                                <Input name="hourEnd" id="hourEnd" type="time" placeholder="Ate" />
                            </div>
                        </div>
                    </div>

                    <label className="mt-2 flex items-center flex-row gap-2 text-sm text-white ">
                        <Checkbox.Root className="w-6 h-6 p-1 rounded bg-zinc-900" 
                                       onCheckedChange={ (checked) => {
                                        if(checked === true){
                                            setVoiceChannel(true);
                                        } else {
                                            setVoiceChannel(false);
                                        }
                                       }}
                                       checked={voiceChannel} >
                            <Checkbox.Indicator>
                                <Check className="w-4 h-4 text-emerald-400 " />
                            </Checkbox.Indicator>
                        </Checkbox.Root>

                        Costumo me conectar ao chat de voz
                    </label>

                    <footer className="mt-4 flex justify-end gap-4">
                        <Dialog.Close type="button" className="bg-zinc-500 px-5 h-12 rounded-md font-semibold  hover:bg-zinc-600" >Cancelar</Dialog.Close>
                        <button type="submit" className="bg-zinc-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600"> <GameController size={24} /> Encontrar duo</button>
                    </footer>
                </form>
            </Dialog.Content>
        </Dialog.Portal> 
    );
}