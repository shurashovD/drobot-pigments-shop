import { ChangeEvent, useEffect, useState } from "react"
import { Button, Col, Fade, Form, InputGroup, Row, Spinner } from "react-bootstrap"
import { useGetCartQuery, useResetPromocodeMutation, useSetPromocodeMutation } from "../../application/order.service"

const PromocodeComponent = () => {
    const { data: cart, isFetching: cartFetching } = useGetCartQuery(undefined)
    const [setPromocode, { data: message, isLoading }] = useSetPromocodeMutation()
    const [reset, { isLoading: resetLoading, isSuccess }] = useResetPromocodeMutation()
    const [code, setCode] = useState('')
    const [validation, setValidation] = useState<string | undefined>()

    const handler = (e: ChangeEvent<HTMLInputElement>) => {
		setValidation(undefined)
        setCode(e.target.value)
	}

    const rmHandler = () => {
        if (!cart?.promocode?.promocodeId || cartFetching || isLoading || resetLoading) {
			return
		}
        reset()
    }

    const clickHandler = () => {
        if ( cart?.promocode?.promocodeId || cartFetching || isLoading || resetLoading ) {
            return
        }
        if ( code === '' ) {
            setValidation("Введите промокод")
            return
        }
        setPromocode({ code })
    }

    useEffect(() => {
        if ( validation ) {
            setTimeout(() => setValidation(undefined), 4000)
        }
    }, [validation])

    useEffect(() => {
        if ( cart?.promocode?.code ) {
            setCode(cart?.promocode?.code)
        }
    }, [cart])

    useEffect(() => {
        if ( isSuccess ) {
            setCode('')
        }
    }, [isSuccess])

	useEffect(() => {
		if ( message?.message ) {
			setValidation(message?.message)
		}
	}, [message])
    
    return (
		<div className="d-flex flex-column align-items-stretch">
			<Fade in={(!!cart?.promocode?.promocodeId || !!validation) && !cartFetching && !isLoading && !resetLoading}>
				<div className="text-end mb-1">
					{validation ? (
						<span className="text-danger">{validation}</span>
					) : (
						<>{cart?.promocode?.promocodeId && <span style={{ color: "#58FF3D" }}>Применён</span>}</>
					)}
					<span className="invisible">1</span>
				</div>
			</Fade>
			<InputGroup className="w-100 border-dark">
				<Row className="g-0 m-0 p-0 w-100">
					<Col xs={9} className="p-0 h-100">
						<Form.Control
							disabled={!!cart?.promocode?.promocodeId || cartFetching || isLoading || resetLoading}
							placeholder="Промокод"
							className={`border-dark p-3 ${cart?.promocode?.promocodeId && "fw-bold"}`}
							value={code}
							onChange={handler}
						/>
					</Col>
					<Col xs={3} className="p-0">
						{!cart?.promocode?.promocodeId && (
							<Button variant="dark" className="w-100 p-0 h-100" onClick={clickHandler} style={{ zIndex: 0 }}>
								{isLoading ? (
									<Spinner animation="border" variant="secondary" size="sm" />
								) : (
									<svg width="21" height="12" viewBox="0 0 21 12" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M19.625 6.16797L-0.000362656 6.16797" stroke="white" strokeWidth="0.9" />
										<path d="M14.5 11.2501L19.625 6.12505L14.5 1" stroke="white" strokeWidth="0.9" />
									</svg>
								)}
							</Button>
						)}
						{cart?.promocode?.promocodeId && (
							<Button variant="link" className="w-100 p-0 h-100 border-dark border-start-0" onClick={rmHandler} style={{ zIndex: 0 }}>
								{isLoading ? (
									<Spinner animation="border" variant="light" size="sm" />
								) : (
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path
											d="M17.0586 20.5762H6.93359C6.83414 20.5762 6.73876 20.5367 6.66843 20.4663C6.5981 20.396 6.55859 20.3006 6.55859 20.2012L5.80859 6.70117H18.1723L17.4223 20.2012C17.4224 20.2987 17.3844 20.3924 17.3165 20.4624C17.2486 20.5324 17.1561 20.5732 17.0586 20.5762Z"
											stroke="#AB9A9A"
											strokeWidth="0.8"
										/>
										<path
											d="M19.125 6.69739H4.875C4.77 6.69739 4.6875 6.63739 4.6875 6.56614L5.03625 4.93489C5.05133 4.89853 5.07769 4.86797 5.11144 4.84772C5.1452 4.82747 5.18457 4.81859 5.22375 4.82239H18.7762C18.8154 4.81859 18.8548 4.82747 18.8886 4.84772C18.9223 4.86797 18.9487 4.89853 18.9637 4.93489L19.3125 6.56614C19.3125 6.63739 19.23 6.69739 19.125 6.69739Z"
											stroke="#AB9A9A"
											strokeWidth="0.8"
										/>
										<path d="M9 8.79004V18.165" stroke="#AB9A9A" strokeWidth="0.8" />
										<path d="M12 8.79004V18.165" stroke="#AB9A9A" strokeWidth="0.8" />
										<path d="M15 8.79004V18.165" stroke="#AB9A9A" strokeWidth="0.8" />
										<path
											d="M9.64844 4.82262V2.83887C9.64844 2.73941 9.68795 2.64403 9.75827 2.5737C9.8286 2.50338 9.92398 2.46387 10.0234 2.46387H13.9759C14.0754 2.46387 14.1708 2.50338 14.2411 2.5737C14.3114 2.64403 14.3509 2.73941 14.3509 2.83887V4.82262"
											stroke="#AB9A9A"
											strokeWidth="0.8"
										/>
									</svg>
								)}
							</Button>
						)}
					</Col>
				</Row>
			</InputGroup>
		</div>
	)
}
export default PromocodeComponent