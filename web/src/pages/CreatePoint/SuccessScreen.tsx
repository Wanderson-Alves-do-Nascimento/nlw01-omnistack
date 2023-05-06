import './SuccessScreen.css'
import check from '../../assets/check.svg'

export function SuccessScreen() {
  return (
    <div className="modal hide">
      <div className="completed-icon">
        <img src={check} alt="Cadastro concluído" />
        <p>Cadastro concluído!</p>
      </div>
    </div>
  )
}