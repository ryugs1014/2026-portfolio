'use client';

import React, { useState } from 'react';
import s from './Section_Form.module.scss';
import Container from '@/components/layout/Container';
import Spinner from '@/components/atoms/loading/Spinner';
import RightArrow from '@public/svg/common/right-arrow.svg';
import PixelSmile from '@public/svg/common/pixel-smile.svg';
import FadeIn from '@/components/atoms/animation/FadeIn';

interface FormDataType {
  name: string;
  company: string;
  phone: string;
  email: string;
  message: string;
}

interface ToastType {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function Section_Form() {
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [form, setForm] = useState<FormDataType>({
    name: '',
    company: '',
    phone: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormDataType, string>>
  >({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const addToast = (
    message: string,
    type: 'success' | 'error' | 'info' = 'info',
  ) => {
    const id = new Date().getTime();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      e.target instanceof HTMLInputElement && e.target.type === 'checkbox'
        ? e.target.checked
        : false;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFocusedField(e.target.name);
  };

  // 블러(포커스 해제) 핸들러
  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleConfirmSubmit = () => {
    const newErrors: Partial<Record<keyof FormDataType, string>> = {};

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!form.name.trim()) newErrors.name = '- 이름을 입력해주세요.';
    if (!form.email.trim()) {
      newErrors.email = '- 이메일을 입력해주세요.';
    } else if (!emailRegex.test(form.email.trim())) {
      newErrors.email = '- 올바른 이메일 형식이 아닙니다.';
    }
    if (!form.message.trim()) newErrors.message = '- 문의 내용을 입력해주세요.';
    // if (!form.company.trim()) newErrors.company = '- 기업명을 입력해주세요.';
    // if (!form.phone.trim()) newErrors.phone = '- 연락처를 입력해주세요.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.email === '- 올바른 이메일 형식이 아닙니다.') {
        addToast('올바른 이메일 형식을 입력해주세요.', 'error');
      } else {
        addToast('필수로 작성해야 하는 항목이 빠져있습니다.', 'error');
      }
      return;
    }

    setShowModal(true);
  };

  const handleSubmit = async () => {
    setShowModal(false);
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, String(value)),
    );

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();

      if (result.success) {
        addToast('문의가 성공적으로 전송되었습니다.', 'success');
        setForm({
          name: '',
          company: '',
          phone: '',
          email: '',
          message: '',
        });
      } else {
        addToast(result.error || '전송 중 오류가 발생했습니다.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('서버와의 통신 중 오류가 발생했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={s['section-wrap']}>
      <FadeIn>
        <form className={s['form-wrap']} onSubmit={(e) => e.preventDefault()}>
          <Container size={'small'}>
            <div className={s['input-group-wrap']}>
              <div
                className={`${s['input-group']} ${s['forced']} ${focusedField === 'name' ? s['focused'] : ''} ${form.name ? s['has-value'] : ''}
                ${errors.name ? s['has-error'] : ''}
                `}
              >
                <span className={s['place-holder']}>
                  <div className={s['en']}>Name</div>
                  <div className={s['kr']}>(담당자명)</div>
                  <div className={s['force']}>*</div>
                </span>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={s['text-input']}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              <div
                className={`${s['input-group']} ${s['forced']} ${focusedField === 'company' ? s['focused'] : ''} ${form.company ? s['has-value'] : ''}
                `}
              >
                <span className={s['place-holder']}>
                  <div className={s['en']}>Company</div>
                  <div className={s['kr']}>(기업명)</div>
                </span>

                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className={s['text-input']}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            <div className={s['input-group-wrap']}>
              <div
                className={`${s['input-group']} ${s['email-wrap']} ${s['forced']} ${focusedField === 'email' ? s['focused'] : ''} ${form.email ? s['has-value'] : ''}
                ${errors.email ? s['has-error'] : ''}
                `}
              >
                <span className={s['place-holder']}>
                  <div className={s['en']}>Email</div>
                  <div className={s['kr']}>(이메일)</div>
                  <div className={s['force']}>*</div>
                </span>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={s['text-input']}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              <div
                className={`${s['input-group']} ${s['forced']} ${focusedField === 'phone' ? s['focused'] : ''} ${form.phone ? s['has-value'] : ''}
                `}
              >
                <span className={s['place-holder']}>
                  <div className={s['en']}>H.P</div>
                  <div className={s['kr']}>(연락처)</div>
                </span>

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={s['text-input']}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            <div
              className={`${s['input-group']} ${s['input-textarea-group']} ${s['forced']} ${focusedField === 'message' ? s['focused'] : ''} ${form.message ? s['has-value'] : ''}
                ${errors.message ? s['has-error'] : ''}
                `}
            >
              <span className={s['place-holder']}>
                <div className={s['en']}>Message</div>
                <div className={s['kr']}>(남기실 메시지)</div>
                <div className={s['force']}>*</div>
              </span>

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          </Container>

          <div className={s['button-wrap']}>
            <button
              className={s['submit-button']}
              type="button"
              onClick={handleConfirmSubmit}
              disabled={loading}
            >
              <Container size={'small'} className={s['button-container']}>
                <span>Send</span>

                <div className={s['svg-box']}>
                  <RightArrow width="54" height="54" viewBox="0 0 36 36" />
                </div>
              </Container>
            </button>
          </div>
        </form>
      </FadeIn>

      <Container size={'small'}>
        <div className={s['message-wrap']}>
          <div className={s['message-title']}>
            <span>언제든 편하게 연락주세요</span>

            <div className={s['svg-box']}>
              <PixelSmile width="48" height="48" viewBox="0 0 48 48" />
            </div>
          </div>
          <span className={s['message-sub']}>
            1–2일 이내에 반드시 답장을 드릴게요
          </span>
        </div>
      </Container>

      {showModal && (
        <div className={s['modal-overlay']}>
          <div className={s['modal']}>
            <h3>문의 내용을 제출하시겠습니까?</h3>
            <p>제출 후에는 수정이 불가합니다.</p>
            <div className={s['modal-buttons']}>
              <button className={s['confirm']} onClick={handleSubmit}>
                확인
              </button>
              <button
                className={s['cancel']}
                onClick={() => setShowModal(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={s['toast-container']}>
        {toasts.map((toast) => (
          <div key={toast.id} className={`${s['toast']} ${s[toast.type]}`}>
            {toast.message}
          </div>
        ))}
      </div>

      {loading && (
        <div className={s['global-loading']}>
          <Spinner size={48} floating />
        </div>
      )}
    </section>
  );
}
