import SettingSideLinks from '@/components/Custom/SideLinks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { Input } from '@/components/ui/input'
import { setBreadcrumb } from '@/redux/Features/uiSlice'
import { useAppDispatch } from '@/redux/hooks'
import { ChevronLeft } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SettingsPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const handleGoBack = () => navigate(-1);
    useEffect(() => {
        dispatch(setBreadcrumb([
            { label: 'Dashboard', link: '/dashboard' },
            { label: 'Settings', link: '/settings' },
            { label: 'General', type: 'page' }
        ]))
    }, []);
    return (
        <div className='px-6 pt-6'>
            <div className="flex justify-between items-center mb-3">
                <div className="flex gap-4 items-center">
                    <Button onClick={handleGoBack} variant={'outline'} size={'icon'}><ChevronLeft className='size-4' /></Button>
                    <h1 className='font-bold capitalize'>Settings</h1>
                </div>
                <div className="grid grid-cols-2 gap-4">

                </div>
            </div>
            <main className="grid flex-1 items-start gap-4 p-4 mt-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-4" >
                <SettingSideLinks />
                <div className="grid gap-4 lg:col-span-3 lg:relative">
                    <Card x-chunk="dashboard-04-chunk-1">
                        <CardHeader>
                            <CardTitle>General Settings</CardTitle>
                            <CardDescription>
                                Some settings for general purpose.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form>
                                <Input placeholder="Setting Name" />
                            </form>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button>Save</Button>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    )
}

export default SettingsPage