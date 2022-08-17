import { Play } from 'phosphor-react';
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountdownButton, TaskInput } from './styles';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useState } from 'react';

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe sua tarefa'),
    minutesAmount: zod
        .number()
        .min(5, 'O número não pode ser menor que 5 minutos')
        .max(60, 'o número não pode passar de 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
}

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

    const { register, handleSubmit, watch, reset} = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    })

    function handleCreateNewCycle(data: NewCycleFormData) {
        const id = String(new Date().getTime());
        
        const newCycle: Cycle = {
            id, 
            task: data.task,
            minutesAmount: data.minutesAmount,
        }

        setCycles(state => [...state, newCycle])
        setActiveCycleId(id)

        reset();
    };

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    const task = watch('task');
    const isSubmitDisabled = !task;
    
    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput 
                        id="task" 
                        list='task-suggestions' 
                        placeholder='Dê um nome para o seu projeto'
                        {...register('task')}
                    />
                    <datalist id='task-suggestions'>
                        <option value="1" />
                        <option value="2" />
                        <option value="3" />
                        <option value="4" />
                        <option value="5" />

                    </datalist>

                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesAmountInput 
                        type="number" 
                        id="minutesAmount" 
                        placeholder="00"
                        step={10} 
                        min={5} 
                        max={60}
                        {...register('minutesAmount', { valueAsNumber: true })}
                    />

                    <span>minutos.</span>
                </FormContainer>

                <CountdownContainer>
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountdownContainer>

                <StartCountdownButton 
                    disabled={!task}
                    type="submit"
                >
                    <Play size={24}/>
                    Começar
                </StartCountdownButton>
            </form>
        </HomeContainer>
    );
}