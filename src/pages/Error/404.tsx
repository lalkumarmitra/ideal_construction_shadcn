import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import { Link } from 'react-router-dom'

const _404: React.FC = () => {
    return (
        <div className='h-screen w-screen flex justify-center items-center flex-col px-2'>
            <Card>
                <CardContent className='pt-6 pb-0'>
                    <h1 className='lg:text-8xl text-6xl text-muted text-center'>404</h1>
                    <h3 className='lg:text-4xl text-xl text-primary-foreground text-center'>Page Not Found</h3>
                    <img src="https://fittestwarrior.com/static/media/error-img.352b9ab6d7d633e85325.png" alt="" className='w-96' />
                    <div className='my-4 text-center'>
                        <Link to={'/'} >
                            <Button variant={'outline'} className='' >Back To Home Page</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default _404